import { faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default ({ refreshUser, setUserObj, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profileImage, setProfileImage] = useState("");
  const history = useHistory();
  useEffect(async () => {
    const profile = await dbService
      .collection("profiles")
      .where("uId", "==", userObj.uid)
      .get();
    if(profile.docs.length > 0) {
      setProfileImage(profile.docs[0].data().attachmentUrl);
    }
  }, [])
  const onLogOutClick = () => {
    authService.signOut();
    setUserObj((prev) => !prev);
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value }
    } = event;
    setNewDisplayName(value);
  }
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    const myNweetArray = nweets.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  useEffect(() => {
    getMyNweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if(profileImage !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`profiles/${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(profileImage, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
      const profileObj = {
        createdAt: Date.now(),
        uId: userObj.uid,
        attachmentUrl: attachmentUrl
      }
      const prevProfile = await dbService
        .collection("profiles")
        .where("uId", "==", userObj.uid)
        .get();
      if(prevProfile.docs.length > 0) {
        await dbService.doc(`profiles/${prevProfile.docs[0].id}`).update(profileObj);
      } else {
        await dbService.collection("profiles").add(profileObj);
      }
    }
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName
      });
      refreshUser();
    }
  }
  const onattachmentChange = (event) => {
    const { 
      target: { files }
     } = event;
     const theFile = files[0];
     const reader = new FileReader();
     reader.onloadend = (finishedEvent) => {
        const { 
          currentTarget: { result } 
        } = finishedEvent;
        setProfileImage(result);
     }
     reader.readAsDataURL(theFile);
  }
  const onClearAttachmentClick = () => setProfileImage("");
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <div className="factoryImage__container">
          <div className="factoryForm__attachment">
            {profileImage ? (
              <>
                <img 
                  src={profileImage} 
                  style={{
                    backgroundImage: profileImage,
                  }}
                />
                <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </>
            ) : (
              <img 
                src= "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"
                className="factoryForm__defaultImage"
              />
            )}
              <div class="EditProfile__icon">
              <label for="attach-file" className="factoryInput__label">
                <FontAwesomeIcon icon={faPen} />
              </label>
              <input 
                id="attach-file"
                type="file" 
                accept="image/*" 
                onChange={onattachmentChange} 
                style={{
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0
                }}
              />
            </div>
          </div>
        </div>
        <input 
          type="text"
          autoFocus
          placeholder="Display name" 
          onChange={onChange}
          value={newDisplayName}
          className="formInput"
        />
        <input 
          type="submit" 
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  )
};
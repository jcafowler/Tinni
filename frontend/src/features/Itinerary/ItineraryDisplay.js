import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ItneraryList from "./ItineraryList";
import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import LoginDialog from "../LoginDia/LoginDial";
import ShareDialog from "../ShareForm/ShareFormDial";
import {
  selectCurrentItin,
  selectCurrentItinAll,
} from "../CurrentItinerary/currentItinerarySlice";
import { selectInfo, logOutUser, selectUserID } from "../Users/usersSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  updateItinTime,
  updateID,
  updateTitle,
  updateDate,
  setID,
} from "../CurrentItinerary/currentItinerarySlice";
import "./ItineraryDisplay.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { getAPI } from "../../util/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2),
    },
  },
  textField: {
    width: 200,
    color: "black",
    fontSize: 20,
    opacity: 1,
    borderBottom: 0,
    "&:before": {
      borderBottom: 0,
    },
  },
  disabled: {
    color: "black",
    borderBottom: 0,
    "&:before": {
      borderBottom: 0,
    },
  },
}));

export default function ItineraryDisplay() {
  const classes = useStyles();
  const currentItinerary = useSelector(selectCurrentItin);
  const currentUserId = useSelector(selectUserID);

  const currentItineraryAll = useSelector(selectCurrentItinAll);
  const [ItineraryName, setItineraryName] = useState("My Itinerary");
  const [ItineraryDate, setItinerarydate] = useState("");
  const [ItineraryTime, setItineraryTime] = useState("12:00");
  const [editMode, setEditMode] = useState(false);
  const userInformation = useSelector(selectInfo);
  const [currUser, setcurrUser] = useState(false);
  const [opendia, setOpenDia] = useState(false);
  const [opendiaEmail, setOpenDiaEmail] = useState(false);
  const [openMessage, setopenMessage] = useState("none");
  const API = getAPI();
  const dispatch = useDispatch();

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  useEffect(() => {
    if (!currentItineraryAll.id) {
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var today = now.getFullYear() + "-" + month + "-" + day;
      setItinerarydate(today);
      dispatch(updateDate(today));
    } else {
      setItinerarydate(currentItineraryAll["Date"]);
      setItineraryTime(currentItineraryAll.Time);
    }

    setItineraryName(currentItineraryAll.Title);

    // setItineraryTime(currentItineraryAll.Time);
  }, []);

  const handleDiaClose = (value) => {
    setOpenDia(false);
    // setSelectedValue(value);
  };
  const handleEmailDiaClose = (value) => {
    setOpenDiaEmail(false);
    //  setSelectedValue(value);
  };

  const handleClick = () => {
    setEditMode(true);
  };
  const handleDone = () => {
    setEditMode(false);

    dispatch(updateItinTime(ItineraryTime));
    dispatch(updateTitle(ItineraryName));
    dispatch(updateDate(ItineraryDate));
  };

  const handleClickSave = () => {
    if (!userInformation) {
      setOpenDia(true);
    } else {
      saveItinerary(true);
    }
  };
  const handleClickShare = () => {
    debugger;
    if (!userInformation) {
      setOpenDia(true);
    } else {
      setOpenDiaEmail(true);
    }
  };

  const saveItinerary = async () => {
    debugger;
    console.log(currentItineraryAll);
    if (!currentItineraryAll.id) {
      try {
        let res = await axios.post(`${API}/itineraries`, {
          user_id: currentUserId,
          itinerary_date: currentItineraryAll["Date"],
          title: currentItineraryAll.Title,
          itinerary_StartTime: currentItineraryAll["Time"],
        });
        debugger;
        saveItems(res.data.payload[0].id);
        dispatch(updateID(res.data.payload[0].id));
        successMessage();
      } catch (error) {
        console.log(error);
      }
    } else if (currentItineraryAll.id) {
      try {
        let res = await axios.patch(
          `${API}/itineraries/${currentItineraryAll.id}`,
          {
            user_id: currentUserId,
            itinerary_date: currentItineraryAll["Date"],
            title: currentItineraryAll.Title,
            itinerary_StartTime: currentItineraryAll.Time,
          }
        );
        currentItems(res.data.payload[0].id);
      } catch (err) {
        console.log(err);
      }
    }

    const currentItems = async (id) => {
      currentItinerary.forEach(async (item) => {
        try {
          let patchActivity = {
            itin_id: id,
            location: item.address,
            longitude: item.longitude,
            latitude: item.latitude,
            activity_name: item.name,
            image: item.image_url,
            StartTime: item.time.startTime,
            EndTime: item.time.endTime,
            duration: item.time.duration,
          };
          await axios.patch(`${API}/activites`, patchActivity);
        } catch (error) {
          console.log(error);
        }
      });
    };
  };

  const successMessage = () => {
    setopenMessage("block");
  };

  const saveItems = async (id) => {
    currentItinerary.forEach(async (item, i) => {
      debugger;
      try {
        let activity = {
          itin_id: id,
          location: item.body.address,
          longitude: item.body.longitude,
          latitude: item.body.latitude,
          activity_name: item.body.name,
          image: item.body.image_url,
          StartTime: item.body.time.startTime,
          EndTime: item.body.time.endTime,
          duration: item.body.time.duration,
          id: item.body.id,
        };
        debugger;
        let res = await axios.post(`${API}/activites`, activity);

        dispatch(setID({ id: res.data.payload.id, index: i }));
        debugger;
      } catch (error) {
        console.log(error);
      }
    });
  };

  const navButton = () => {
    return (
      <div id="navItin">
        <IconButton
          onClick={handleClickSave}
          style={{ backgroundColor: "#09BC8A" }}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          onClick={handleClickShare}
          style={{ backgroundColor: "#09BC8A" }}
        >
          <ShareIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div class="top" style={{ marginTop: "25px", padding: "0px" }}>
        <div class="menu" style={{ margin: "0px", padding: "0px" }}></div>
      </div>
      <div
        class="time"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0px",
          padding: "0px",
        }}
      >
        <TextField
          name="ItineraryName"
          id="ItineraryName"
          // defaultValue={value}
          value={ItineraryName}
          margin="none"
          style={{ margin: "0px", padding: "0px" }}
          onChange={(e) => setItineraryName(e.target.value)}
          disabled={!editMode}
          className={classes.textField}
          InputProps={{
            classes: {
              disabled: classes.disabled,
            },
          }}
        />
        <TextField
          name="ItineraryDate"
          id="ItineraryDate"
          type="date"
          style={{ margin: "0px", padding: "0px" }}
          value={ItineraryDate}
          margin="none"
          onChange={(e) => {
            setItinerarydate(e.target.value);
          }}
          disabled={!editMode}
          className={classes.textField}
          InputProps={{
            classes: {
              disabled: classes.disabled,
            },
          }}
        />
        <TextField
          name="ItineraryDate"
          id="ItineraryDate"
          type="time"
          margin="none"
          style={{ margin: "0px", padding: "0px" }}
          value={ItineraryTime}
          onChange={(e) => {
            setItineraryTime(e.target.value);
          }}
          margin="normal"
          disabled={!editMode}
          className={classes.textField}
          InputProps={{
            classes: {
              disabled: classes.disabled,
            },
          }}
        />
      </div>

      <div className="middle">
        {editMode ? (
          <InputAdornment position="end">
            <IconButton
              onClick={handleDone}
              style={{ backgroundColor: "#09BC8A" }}
            >
              <DoneIcon />
            </IconButton>
          </InputAdornment>
        ) : (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClick}
              style={{ backgroundColor: "#09BC8A" }}
            >
              <Edit />
            </IconButton>
          </InputAdornment>
        )}
        <div
          style={{
            marginTop: "35px",
            marginLeft: "10px",
            height: "270px",
            marginRight: "0px",
            overflow: "scroll",
          }}
        >
          <ItneraryList time={ItineraryTime} />
          {currentItinerary.length ? (
            <>{navButton()}</>
          ) : (
            <p
              style={{ marginTop: "50px", color: "crimson", fontSize: "20px" }}
            >
              Add Items to Itinerary
            </p>
          )}
          <p style={{ color: "green", display: openMessage }}>Success saved </p>
          <LoginDialog open={opendia} onClose={handleDiaClose} />

          <ShareDialog
            open={opendiaEmail}
            onClose={handleEmailDiaClose}
            setOpenDiaEmail={setOpenDiaEmail}
          />

          {/* <SendSmsDialog open={opendiaText} onClose={handleTextItin} /> */}
        </div>
      </div>
    </div>
  );
}

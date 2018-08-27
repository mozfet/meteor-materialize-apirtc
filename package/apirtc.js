import {apiRTC} from './external/apiRTC-v2.0.3.min.debug'

function selectPhonebookItem(idItem) {
    $("#number").val(idItem);
    $("#addressBookDropDown").toggle();
}

function addStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {

    var mediaElt = null,
        divElement = null;

    if (callType === 'audio') {
        mediaElt = document.createElement("audio");
    } else {
        mediaElt = document.createElement("video");
    }
    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;

    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    //Patch for ticket on Chrome 61 Android : https://bugs.chromium.org/p/chromium/issues/detail?id=769148
    if (apiRTC.browser === 'Chrome' && apiRTC.browser_major_version === '61' && apiRTC.osName === "Android") {
        mediaElt.style.borderRadius = "1px";
        console.log('Patch for video display on Chrome 61 Android');
    }

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    webRTCClient.attachMediaStream(mediaElt, stream);
}

function removeElementFromDiv(divId, eltId) {

    var element = null,
        divElement = null;

    element = document.getElementById(eltId);
    if (element !== null) {
        console.log('Removing video element with Id : ' + eltId);
        divElement = document.getElementById(divId);
        divElement.removeChild(element);
    }
}

function initMediaElementState(callId) {
  webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
  webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
}

function addHangupButton(callId) {
    var hangupButtons = document.getElementById("hangupButtons"),
        input = document.createElement("input");

    input.setAttribute("id", "hangup-" + callId);
    input.setAttribute("value", "hangup-" + callId);
    input.setAttribute("type", "button");
    input.setAttribute("onclick", "webRTCClient.hangUp(" + callId + " );");
    hangupButtons.appendChild(input);
}

function removeHangupButton(callId) {
  var hangupButtonId = 'hangup-' + callId,
      hangupButton = document.getElementById(hangupButtonId),
      hangupButtons = null;

  if (hangupButton !== null) {
    console.log('Removing hangUpButton with Id : ' + hangupButtonId);
    hangupButtons = document.getElementById("hangupButtons");
    hangupButtons.removeChild(hangupButton);
  }
}

function userMediaErrorHandler(e) {
    $("#call").attr("disabled", false).val("Call");
    $("#hangup").attr("disabled", false).val("Hangup");
}

function hangupHandler(e) {
    console.log('hangupHandler :' + e.detail.callId);

    if (e.detail.lastEstablishedCall === true) {
        $("#call").attr("disabled", false).val("Call");
    }
    console.log(e.detail.reason);

    initMediaElementState(e.detail.callId);
    removeHangupButton(e.detail.callId);
}

function incomingCallHandler(e) {
  $("#hangup").attr("disabled", false).val("Hangup");
  $("#accept").attr("disabled", false).val("Accept");
  $("#refuse").attr("disabled", false).val("Refuse");
  addHangupButton(e.detail.callId);
  incomingCallId = e.detail.callId;
}

function userMediaSuccessHandler(e) {
  console.log("userMediaSuccessHandler e.detail.callId :" + e.detail.callId);
  console.log("userMediaSuccessHandler e.detail.callType :" + e.detail.callType);
  console.log("userMediaSuccessHandler e.detail.remoteId :" + e.detail.remoteId);
  webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini",
    'miniElt-' + e.detail.callId, {width : "128px", height : "96px"}, true)
}

function remoteStreamAddedHandler(e) {
  console.log("remoteStreamAddedHandler, e.detail.callId :" + e.detail.callId);
  console.log("remoteStreamAddedHandler, e.detail.callType :" + e.detail.callType);
  console.log("userMediaSuccessHandler e.detail.remoteId :" + e.detail.remoteId);
  webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote",
      'remoteElt-' + e.detail.callId, {width : "640px", height : "480px"},
      false);
}

function updateAddressBook() {
    console.log("updateAddressBook");
    var length = connectedUsersList.length,
        i = 0;

    //Cleaning addressBook list
    $("#addressBookDropDown").empty();

    for (i = 0; i < length; i += 1) {

        //Checking if connectedUser is not current user befire adding in addressBook list
        if (connectedUsersList[i].userId !== apiRTC.session.apiCCId) {

            if(connectedUsersList[i].group !== undefined) {

                $("#addressBookDropDown").append('<li><a href="#" onclick="selectPhonebookItem(' + connectedUsersList[i].userId + ')">' + connectedUsersList[i].userId + ' - ' + connectedUsersList[i].group + '</a></li>');
            } else {
                $("#addressBookDropDown").append('<li><a href="#" onclick="selectPhonebookItem(' + connectedUsersList[i].userId + ')">' + connectedUsersList[i].userId + '</a></li>');
            }
        }
    }
}

function connectedUsersListUpdateHandler(e) {
    console.log("connectedUsersListUpdateHandler, e.detail.group :" + e.detail.group);

    //getting complete connectedUsersList
    //connectedUsersList = apiRTC.session.getConnectedUsersList();

    //getting connectedUsersList of updated group
    //connectedUsersList = apiRTC.session.getConnectedUsersList(e.detail.group);

    connectedUsersList = apiRTC.session.getConnectedUserIdsList();
    //console.log("connectedUsersList.length :" + connectedUsersList.length);

    //Updating addressBook
    updateAddressBook();
}

function webRTCClientCreatedHandler(e) {
    console.log('webRTCClientCreatedHandler');
}

function sessionReadyHandler(e) {
  console.log('sessionReadyHandler :' + apiRTC.session.apiCCId);

  $("#call").attr("disabled", false).val("Call");   //Modification of Call button when phone is registered on Apizee

  apiRTC.addEventListener("userMediaSuccess", userMediaSuccessHandler);
  apiRTC.addEventListener("incomingCall", incomingCallHandler);
  apiRTC.addEventListener("userMediaError", userMediaErrorHandler);
  apiRTC.addEventListener("hangup", hangupHandler);
  apiRTC.addEventListener("remoteStreamAdded", remoteStreamAddedHandler);
  apiRTC.addEventListener("connectedUsersListUpdate", connectedUsersListUpdateHandler);
  apiRTC.addEventListener("webRTCClientCreated", webRTCClientCreatedHandler);
  webRTCClient = apiRTC.session.createWebRTCClient({
    status : "status" //Optionnal
  });

  webRTCClient.setAllowMultipleCalls(true);
  webRTCClient.setVideoBandwidth(300);
  webRTCClient.setUserAcceptOnIncomingCall(true);

  $("#callVideo").click(function () {
    $("#hangup").attr("disabled", false).val("Hangup");
    var callId = webRTCClient.call($("#number").val());
    console.log("callId on call =" + callId);
    if (callId != null) {
      addHangupButton(callId);
    }
  });

  $("#hangup").click(function () {
    $("#call").attr("disabled", false).val("Call");
    webRTCClient.hangUp();
  });

  $("#accept").click(function () {
    $("#accept").attr("disabled", true).val("Accept");
    $("#refuse").attr("disabled", true).val("Refuse");
    webRTCClient.acceptCall(incomingCallId);
  });

  $("#refuse").click(function () {
    $("#accept").attr("disabled", true).val("Accept");
    $("#refuse").attr("disabled", true).val("Refuse");
    $("#hangup").attr("disabled", true).val("Hangup");
    webRTCClient.refuseCall(incomingCallId);

    initMediaElementState(incomingCallId);
    removeHangupButton(incomingCallId);
  });
});

const api = {
  selectPhonebookItem,
  addStreamInDiv,
  removeElementFromDiv,
  initMediaElementState,
  addHangupButton,
  removeHangupButton,
  userMediaErrorHandler,
  hangupHandler,
  incomingCallHandler,
  userMediaSuccessHandler,
  remoteStreamAddedHandler,
  updateAddressBook,
  connectedUsersListUpdateHandler,
  webRTCClientCreatedHandler,
  sessionReadyHandler
}
export default api

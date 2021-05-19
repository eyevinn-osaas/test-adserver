const ClientRequest = require("./ClientRequest.js");
const EventTracker = require("./EventTracker.js")
const User = require("./User.js");
const { VastBuilder } = require("../utils/vast-maker");
const { v4: uuid } = require("uuid");

class Session {
  // Public Fields
  sessionId;
  adBreakDuration;
  created;
  // Private Fields
  #clientRequest;
  #user;
  #vastXml;
  #eventTracker

  constructor(queryParams) {
    // Take a time stamp.
    const timeStamp = new Date().toISOString();

    this.created = timeStamp;
    this.sessionId = uuid();
    this.#user = new User(queryParams.uid || null);

    this.#clientRequest = new ClientRequest(queryParams);
    this.#eventTracker = new EventTracker();

    // Create Vast object.
    const vastObj = VastBuilder({
      sessionId: this.sessionId,
      desiredDuration: queryParams.dur || "0",
      adserverHostname:
        process.env.ADSERVER || `localhost:${process.env.PORT || "8080"}`,
    });

    this.#vastXml = vastObj.xml;
    this.adBreakDuration = vastObj.duration;
  }

  getUser() {
    return this.#user.getUserId();
  }

  getVastXml() {
    return this.#vastXml;
  }

  getClientRequest() {
    return this.#clientRequest.getAllQueryParameters();
  }

  getTrackedEvents(){
    return this.#eventTracker.getEvents();
  }

  AddTrackedEvent(eventObj){
    this.#eventTracker.AddEvent(eventObj);
  }

}

module.exports = Session;

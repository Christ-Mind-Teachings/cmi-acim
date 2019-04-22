/*
  Teaching specific data
*/

const keyInfo = require("./modules/_config/key");
import {getPageInfo} from "./modules/_config/config";

export default {
  sid: "ACIM",
  getPageInfo: getPageInfo,              //list
  keyInfo: keyInfo,                      //list, bmnet
  bm_modal_key: "bm.acim.modal",         //list
  bm_creation_state: "bm.acim.creation", //bookmark
  bm_list_store: "bm.acim.list",         //bmnet
  bm_topic_list: "bm.acim.topics",       //bmnet
  bm_modal_store: "bm.acim.modal",       //navigator
  url_prefix: "/t/acim"                  //navigator
};

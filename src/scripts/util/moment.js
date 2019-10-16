import moment from "moment";

export function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
}
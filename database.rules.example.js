
// "root.child('valid_colors/' + newData.val()).exists()"

// a valid widget must have attributes "color" and "size"
// allows deleting widgets (since .validate is not applied to delete rules)
// ".validate": "newData.hasChildren(['color', 'size'])",
// "size": {
//   // the value of "size" must be a number between 0 and 99
//   ".validate": "newData.isNumber() &&
//                 newData.val() >= 0 &&
//                 newData.val() <= 99"
// },

// The room's topic can be changed if the room id has "public" in it
// ".write": "$room_id.contains('public')"

// "${subpath}": {
//   //
//   ".write": "root.child('users').child(auth.uid).child('role').val() == 'admin'",
//   ".read": true
// }

// “$uid”: {
//   “.validate”: “newData.hasChildren([‘username’, ‘timestamp’])”
//   }

// “.write”: “!data.exists()”

// "timestamp": { 
//   ".validate": "newData.val() <= now" 
// }

// "$uid": {
//   ".write": "newData.exists()"
// }

// "$uid": {
//   ".write": "!data.exists() || !newData.exists()"
// }

// "$uid": {
//   ".write": "data.exists() && newData.exists()"
// }

// “$uid”: {
//   “.validate”: “newData.hasChildren([‘username’, ‘timestamp’])”
//   }
module.exports = {
  name: { type: String, required:true, unique: true, minlength: 3 },
  number: { type: String, required:true, unique:false, minlength: 8 }
}
import multer from "multer";


const storage = multer.memoryStorage()

// files is the name of the field in the form-data, 10 is the max number of files that can be uploaded at once
const uploadFiles = multer({storage}).array("files", 10)

export default uploadFiles;


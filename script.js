//handle file upload functionality and display the list of uploaded files.
// AWS S3 configuration
const bucketName = 'your-bucket-name'; // Replace with your S3 bucket name
const bucketRegion = 'us-east-1'; // Replace with your bucket region
const IdentityPoolId = 'your-identity-pool-id'; // Replace with your Cognito Identity Pool ID (if using)

// Initialize the Amazon Cognito credentials provider
AWS.config.region = bucketRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});

// Create S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: bucketName },
});

// Function to upload files to S3
function uploadFiles() {
    const files = document.getElementById('file-input').files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const fileKey = 'uploads/' + fileName; // Use a directory structure if desired

        const params = {
            Key: fileKey,
            Body: file,
            ACL: 'public-read', // Make uploaded file public
        };

        s3.upload(params, function(err, data) {
            if (err) {
                console.log('Error uploading file:', err);
            } else {
                console.log('File uploaded successfully:', data);
                displayUploadedFile(fileName);
            }
        });
    }
}

// Function to display uploaded files
function displayUploadedFile(fileName) {
    const filesList = document.getElementById('files');
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/uploads/${fileName}`;
    link.textContent = fileName;
    link.setAttribute('target', '_blank');
    li.appendChild(link);
    filesList.appendChild(li);
}

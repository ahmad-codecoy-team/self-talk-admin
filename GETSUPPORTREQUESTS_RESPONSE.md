# Exact API response from "GET /api/admin/support/' endpoint

{
"success": true,
"statusCode": 200,
"message": "Custom support requests fetched successfully",
"data": {
"supportRequests": [
{
"_id": "69146da38fb02c71fc04f131",
"message": "I am having trouble logging into my account...",
"user": {
"_id": "690468d3f720deb20fd8653d",
"username": "alpha22",
"email": "alpha22@gmail.com",
"profilePicture": "",
"is_suspended": false,
"userCreatedAt": "2025-10-31T07:44:19.319Z"
},
"createdAt": "2025-11-12T11:21:07.041Z",
"updatedAt": "2025-11-12T11:21:07.041Z"
},
{
"_id": "691468d3e1ac113a15210bba",
"message": "I&#x27;m having trouble logging into my account...",
"user": {
"_id": "690468d3f720deb20fd8653d",
"username": "alpha22",
"email": "alpha22@gmail.com",
"profilePicture": "",
"is_suspended": false,
"userCreatedAt": "2025-10-31T07:44:19.319Z"
},
"createdAt": "2025-11-12T11:00:35.484Z",
"updatedAt": "2025-11-12T11:00:35.484Z"
}
]
},
"meta": {
"total": 2,
"limit": 10,
"totalPages": 1,
"currentPage": 1
}
}

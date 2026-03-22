# 📸 Gallery Folder - Your Client Photos

## How to Add Your Client Photos

### Step 1: Add Photos Here
Copy all your client's interior design photos to this folder:
- Bedroom photos: `bedroom-1.jpg`, `bedroom-2.jpg`, etc.
- Living room photos: `living-room-1.jpg`, `living-room-2.jpg`, etc.
- Kitchen photos: `kitchen-1.jpg`, `kitchen-2.jpg`, etc.
- Office photos: `office-1.jpg`, etc.
- Videos (optional): `walkthrough.mp4`, etc.

### Step 2: Update projectsData.js
Open: `src/data/projectsData.js`

Find the commented examples at the bottom and uncomment them. Then customize:

```javascript
{
  _id: 'client-project-1',
  title: 'Your Project Name',
  description: 'Description of the project',
  location: 'City, Area',
  roomType: 'Full House',  // Options: Bedroom, Living Room, Kitchen, Office, Full House
  featured: true,  // Show on homepage?
  images: [
    '/gallery/your-photo-1.jpg',
    '/gallery/your-photo-2.jpg',
    '/gallery/your-photo-3.jpg',
  ],
  videos: [
    '/gallery/your-video.mp4',  // Optional
  ],
}
```

### Step 3: Save and Refresh
After adding photos and updating the data file, your website will automatically refresh and show your client's work!

## Supported File Types
- **Images:** .jpg, .jpeg, .png, .webp
- **Videos:** .mp4, .webm

## Tips
- Use descriptive filenames: `modern-living-room-bandra.jpg`
- Keep file sizes reasonable (compress large images)
- High resolution is great, but 1920px width is usually sufficient for web

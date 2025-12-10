# Background Image Setup Guide

## Required File
You need to add a background image to: `images/login-bg.jpg`

## Image Requirements

### Technical Specifications
- **Format**: JPG or PNG (JPG recommended for smaller file size)
- **Recommended Resolution**: 1920x1080 (Full HD) or 3840x2160 (4K)
- **Aspect Ratio**: 16:9
- **File Size**: Under 3MB (optimize for web)
- **Orientation**: Landscape

### Image Subject
- Cricket stadium with vibrant atmosphere
- Cricket field/ground with clear sky
- Cricket players in action
- Cricket tournament setting
- Green field with good lighting

## Where to Find Free Cricket Stadium Images

### 1. **Unsplash** (https://unsplash.com/)
- Search: "cricket stadium", "cricket ground", "cricket field"
- License: Free to use (no attribution required)
- Quality: High-resolution professional photos
- Download: Select "Download free" → Choose size

### 2. **Pexels** (https://www.pexels.com/)
- Search: "cricket", "stadium", "sports field"
- License: Free for commercial use
- Quality: HD and 4K options available
- Download: Click "Download" → Select resolution

### 3. **Pixabay** (https://pixabay.com/)
- Search: "cricket stadium", "cricket ground"
- License: Free for commercial use
- Quality: Various resolutions
- Download: Select size and download

### 4. **Freepik** (https://www.freepik.com/)
- Search: "cricket stadium background"
- License: Free with attribution (or premium)
- Quality: Professional designs
- Download: Free account required

## How to Add the Image

### Step 1: Download Image
1. Visit one of the websites above
2. Search for "cricket stadium" or "cricket ground"
3. Select a high-quality image (1920x1080 or higher)
4. Download to your computer

### Step 2: Optimize Image (Optional but Recommended)
If the file is larger than 3MB, compress it:
- **Online Tool**: TinyJPG (https://tinyjpg.com/)
- **Desktop Tool**: GIMP, Photoshop, or Paint.NET
- Target: 500KB - 2MB for optimal loading

### Step 3: Place Image in Folder
1. Locate the `images` folder in your tournament website directory
2. Rename your downloaded image to `login-bg.jpg`
3. Copy/paste the image into the `images` folder
4. Final path should be: `images/login-bg.jpg`

## Verification

### Check if Image is Loading
1. Open `index.html` in a web browser
2. You should see the cricket stadium background on the login page
3. If you see a blank background:
   - Check file name is exactly `login-bg.jpg` (case-sensitive)
   - Check file is in the `images` folder
   - Check browser console for errors (F12 → Console tab)

### Browser Cache
If you don't see the new image:
1. Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh
2. Clear browser cache
3. Try in incognito/private window

## Recommended Images

### Suggested Search Terms
- "cricket stadium aerial view"
- "cricket ground with floodlights"
- "cricket field green"
- "cricket match stadium"
- "cricket tournament background"

### Image Style Tips
- **Bright and vibrant**: Creates energetic feel
- **Wide angle**: Shows full stadium/ground
- **High contrast**: Makes text readable
- **Minimal distractions**: Avoid busy backgrounds
- **Professional look**: High-quality, clear images

## Troubleshooting

### Image Not Showing
**Problem**: Blank login page background  
**Solution**:
- Verify file path: `images/login-bg.jpg`
- Check file extension (.jpg not .jpeg)
- Ensure file is not corrupted
- Check file permissions (readable)

### Image Too Dark/Light
**Problem**: Text not readable  
**Solution**:
- The CSS has a dark overlay (`rgba(0, 0, 0, 0.7)`) to improve readability
- Choose a well-lit image
- Adjust overlay in `styles.css` line 23-24 if needed

### Slow Loading
**Problem**: Page loads slowly  
**Solution**:
- Compress image to under 1MB
- Use JPG instead of PNG
- Reduce resolution to 1920x1080
- Use image optimization tools

### Image Distorted
**Problem**: Image stretched or squished  
**Solution**:
- Use 16:9 aspect ratio images
- CSS uses `background-size: cover` which maintains aspect ratio
- Crop image to 16:9 before uploading

## Current CSS Configuration

The background is set in `styles.css` (lines 20-30):
```css
#loginPage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                url('images/login-bg.jpg') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
}
```

The image will:
- Cover entire login page
- Stay fixed while scrolling
- Have a dark overlay for text readability
- Center and scale proportionally

## Support

If you need help:
1. Check file name and path
2. Verify image format (JPG/PNG)
3. Test in different browsers
4. Check browser console for errors

---

**Quick Checklist:**
- [ ] Downloaded cricket stadium image
- [ ] Renamed to `login-bg.jpg`
- [ ] Placed in `images` folder
- [ ] File size under 3MB
- [ ] Tested in browser
- [ ] Background displays correctly

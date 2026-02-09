# Chrome Web Store Submission - Step by Step Guide

## 🎯 Before You Start

### 1. Upload Privacy Policy to Your Website
- Take the file `privacy-policy.html` 
- Upload it to your website at: `https://domainecho.site/privacy`
- **OR** convert `PRIVACY_POLICY.md` to HTML and host it
- **Test the URL** - make sure it's publicly accessible

### 2. Set Your Support Email
- Choose an email address for support
- Update it in `privacy-policy.html` (line with YOUR-EMAIL@DOMAIN.com)
- You'll use this same email in the Chrome Web Store listing

### 3. Prepare Your Screenshots
You mentioned you have 2 promo images. You'll need:
- **Minimum:** 1 screenshot (1280x800 or 640x400 pixels)
- **Recommended:** 3-5 screenshots showing different features

If your promo images aren't the right size, you can:
- Resize them using an image editor
- Or just use them as promotional tiles (optional)

---

## 📝 Step-by-Step Submission Process

### Step 1: Go to Chrome Web Store Developer Dashboard
1. Visit: https://chrome.google.com/webstore/devconsole
2. Sign in with your Google account
3. If this is your first extension, pay the $5 one-time developer fee

### Step 2: Create New Item
1. Click the **"New Item"** button
2. Click **"Choose file"** and select: `domain-echo-v1.0.0.zip`
3. Click **"Upload"**
4. Wait for the upload to complete

### Step 3: Fill Out Store Listing Tab

#### Product Details
**Category:** 
```
Social & Communication
```

**Language:**
```
English (United States)
```

#### Store Listing

**Short Description (132 characters max):**
```
Anonymous, real-time chat rooms for every website you visit. Connect instantly.
```

**Detailed Description:**
```
[Copy the entire "Detailed Description" section from CHROME_STORE_LISTING.md]
```

**Icon:**
- Already included in your zip file (128x128)
- Should auto-populate from manifest.json

**Screenshots:**
1. Click "Add screenshot"
2. Upload your promo images (or screenshots)
3. Add at least 1, recommended 3-5
4. Size: 1280x800 or 640x400 pixels

**Promotional Tiles (Optional but recommended):**
- Small tile: 440x280
- Large tile: 920x680
- Can skip these for now and add later

### Step 4: Privacy Practices Tab

**Single Purpose:**
```
Domain Echo provides anonymous, real-time chat functionality for website visitors, creating isolated chat rooms for each domain to enable instant communication between users visiting the same website.
```

**Permission Justifications:**

For **activeTab**:
```
Required to detect which domain you're visiting to connect you to the correct chat room for that domain.
```

For **storage**:
```
Saves your username preference locally in your browser. No data sent to external servers except chat messages.
```

**Privacy Policy:**
```
https://domainecho.site/privacy
```

**Data Usage:**

*Do you collect user data?*
- ✅ Yes

*What data do you collect?*
- ✅ User-generated content (chat messages)
- ✅ User activity (presence in chat rooms)

*How is the data used?*
- ✅ App functionality (providing chat service)
- ❌ NOT for advertising
- ❌ NOT sold to third parties
- ❌ NOT for analytics

*Is data encrypted in transit?*
- ✅ Yes (HTTPS/WSS)

### Step 5: Distribution Tab

**Visibility:**
```
Public
```

**Pricing:**
```
Free
```

**Regions:**
```
All regions (or select specific countries)
```

### Step 6: Additional Information

**Official URL:**
```
https://domainecho.site
```

**Support Email:**
```
[YOUR-EMAIL@DOMAIN.com]
```

**Content Rating:**
- Age: 13+
- Content type: Social/Communication

### Step 7: Review Everything

Go through each tab and verify:
- [ ] All descriptions are filled in
- [ ] Privacy policy URL is working
- [ ] Screenshots are uploaded
- [ ] Permissions are justified
- [ ] Support email is correct
- [ ] Category is set correctly

### Step 8: Submit for Review

1. Click **"Submit for Review"** button (top right)
2. Review the submission summary
3. Confirm submission
4. Wait for email confirmation

---

## ⏱️ What Happens Next?

### Review Timeline
- **Typical:** 1-3 business days
- **Sometimes:** Up to 1 week
- **Rarely:** May need additional information

### Email Notifications
You'll receive emails for:
- Submission received
- Review in progress
- Approved (goes live automatically)
- OR Rejected (with reasons)

### If Rejected
Common reasons and fixes:
1. **Privacy policy issue** - Make sure URL is accessible
2. **Misleading description** - Ensure accuracy
3. **Broken functionality** - Test thoroughly before resubmitting
4. **Missing information** - Fill in all required fields

You can fix issues and resubmit immediately.

---

## 🎉 After Approval

Once approved:
1. Extension goes live automatically
2. You'll get a Chrome Web Store URL like:
   ```
   https://chrome.google.com/webstore/detail/[extension-id]
   ```
3. Share this URL to let people install your extension
4. Monitor reviews and ratings
5. Respond to user feedback

---

## 📊 Post-Launch Checklist

- [ ] Add Chrome Web Store link to domainecho.site
- [ ] Share on social media
- [ ] Monitor user reviews
- [ ] Track installation stats in developer dashboard
- [ ] Plan for future updates

---

## 🔄 Updating Your Extension

When you want to release an update:

1. Update version in `manifest.json` (e.g., 1.0.0 → 1.0.1)
2. Make your code changes
3. Run `bash package-extension.sh` to create new zip
4. Go to developer dashboard
5. Click on your extension
6. Upload new package
7. Add release notes
8. Submit for review

Updates typically review faster than initial submissions.

---

## 💡 Pro Tips

1. **Test thoroughly** before submitting - rejections delay launch
2. **Write clear descriptions** - helps users understand your extension
3. **Use good screenshots** - increases installation rate
4. **Respond to reviews** - builds trust with users
5. **Monitor analytics** - understand your user base
6. **Keep privacy policy updated** - especially if you add features

---

## 📞 Need Help?

**Chrome Web Store Support:**
- Help Center: https://support.google.com/chrome_webstore/
- Developer Program Policies: https://developer.chrome.com/docs/webstore/program-policies/

**Domain Echo Specific:**
- Review `CHROME_STORE_LISTING.md` for all copy-paste content
- Review `SUBMISSION_CHECKLIST.md` for complete checklist
- Check `PRIVACY_POLICY.md` for privacy details

---

## ✅ Quick Pre-Submission Checklist

Before clicking "Submit for Review":

- [ ] Privacy policy is live at https://domainecho.site/privacy
- [ ] Support email is set and working
- [ ] At least 1 screenshot uploaded
- [ ] All descriptions filled in
- [ ] Permissions justified
- [ ] Tested extension one final time
- [ ] domain-echo-v1.0.0.zip is uploaded
- [ ] All tabs show green checkmarks

---

**Ready? Let's do this! 🚀**

Good luck with your submission!


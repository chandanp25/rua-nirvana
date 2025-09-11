# Book Site Visit Form - Setup Guide

## 🚀 **What's Been Implemented**

### **Frontend Features:**
- ✅ **Modal Form** - Opens when "Book Site Visit" is clicked
- ✅ **Responsive Design** - Works on all devices
- ✅ **Form Validation** - Real-time client-side validation
- ✅ **User Experience** - Loading states, success/error messages
- ✅ **Accessibility** - Keyboard navigation, screen reader friendly

### **Backend Features:**
- ✅ **PHP Processing** - Secure form handling
- ✅ **Data Validation** - Server-side validation and sanitization
- ✅ **Email Notifications** - Admin notification + user confirmation
- ✅ **Security** - Input sanitization, CSRF protection ready
- ✅ **Logging** - Booking activity tracking

## 📋 **Form Fields**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text | ✅ Yes | Min 2 characters |
| Mobile Number | Tel | ✅ Yes | Min 10 digits |
| Email Address | Email | ❌ No | Valid email format |
| Preferred Visit Date | Date | ✅ Yes | Future date only |
| Purpose of Visit | Dropdown | ✅ Yes | Investment/Weekend Home/Agriculture/Other |
| Submit Button | Button | - | "Book My Visit" |

## 🛠️ **Setup Instructions**

### **1. File Structure**
```
your-project/
├── index.html          (updated with modal)
├── styles.css          (updated with modal styles)
├── script.js           (new - modal functionality)
├── process_booking.php (new - PHP backend)
├── database_setup.sql  (optional - database setup)
└── BOOKING_SETUP.md    (this file)
```

### **2. PHP Requirements**
- PHP 7.4+ (recommended: PHP 8.0+)
- `mail()` function enabled
- File write permissions (for logging)

### **3. Email Configuration**
Edit `process_booking.php` and change:
```php
$adminEmail = 'your-email@domain.com'; // Your email address
```

### **4. Database Setup (Optional)**
If you want to store bookings in a database:

1. **Create Database:**
   ```bash
   mysql -u username -p < database_setup.sql
   ```

2. **Update PHP File:**
   Uncomment the database section in `process_booking.php`:
   ```php
   $db = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
   // ... rest of database code
   ```

### **5. Testing**
1. Click "Book Site Visit" in navigation
2. Fill out the form
3. Submit and check:
   - Success message appears
   - Email received (if configured)
   - Log file created (`bookings.log`)

## 🔧 **Customization Options**

### **Form Fields**
- Add/remove fields in `index.html`
- Update validation in `script.js`
- Modify processing in `process_booking.php`

### **Styling**
- Colors: Update CSS variables in `styles.css`
- Layout: Modify `.modal-content` styles
- Animations: Adjust `@keyframes` rules

### **Email Templates**
- Admin notification: Modify `$emailBody` in PHP
- User confirmation: Modify `$userBody` in PHP
- Add HTML formatting for better emails

## 🚨 **Security Features**

- ✅ **Input Sanitization** - All data cleaned
- ✅ **Validation** - Client + server-side validation
- ✅ **CSRF Ready** - Easy to add CSRF protection
- ✅ **SQL Injection Safe** - Prepared statements (if using DB)
- ✅ **XSS Protection** - HTML entities encoding

## 📱 **Responsive Design**

- **Desktop**: Full modal with 500px max-width
- **Tablet**: Adjusted padding and margins
- **Mobile**: Full-width modal, optimized touch targets

## 🔍 **Troubleshooting**

### **Form Not Opening**
- Check if `script.js` is loaded
- Verify modal ID matches in HTML/JS
- Check browser console for errors

### **PHP Not Working**
- Ensure PHP is installed and running
- Check file permissions
- Verify `mail()` function is enabled

### **Emails Not Sending**
- Check server mail configuration
- Verify email addresses are correct
- Check spam/junk folders

### **Database Issues**
- Verify database credentials
- Check table structure
- Ensure proper permissions

## 📞 **Support**

If you need help:
1. Check browser console for JavaScript errors
2. Check server error logs for PHP issues
3. Verify all files are in the correct location
4. Test with a simple PHP file first

## 🎯 **Next Steps**

### **Immediate:**
- Test the form functionality
- Configure admin email address
- Customize styling if needed

### **Optional Enhancements:**
- Add CAPTCHA protection
- Implement rate limiting
- Add admin dashboard for bookings
- SMS notifications
- Calendar integration

---

**🎉 Your Book Site Visit form is ready to use!**

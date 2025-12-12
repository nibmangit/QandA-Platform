

export const getTitleForPath = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Home | Q and A Platform';
      case '/questions':
        return 'All Questions | Q and A Platform';
      case '/ask-question':
        return 'Ask a Question | Q and A Platform';
      case '/categories':
        return 'Categories | Q and A Platform';
      case '/reputation':
        return 'Reputation | Q and A Platform';
      case '/inbox':
        return 'Inbox | Q and A Platform';
      case '/dashboard':
        return 'Dashboard | Q and A Platform';
      case '/notifications':
        return 'Notifications | Q and A Platform';
      case '/announcements':
        return 'Announcements | Q and A Platform';
      case '/help':
        return 'Help Center | Q and A Platform';
      case '/bookmarks':
        return 'Bookmarked Questions | Q and A Platform';
      case '/auth':
        return 'Auth | Q and A Platform';
      case '/notfound':
        return '404 - Page Not Found | Q and A Platform'; 
      default: 
        if (pathname.startsWith('/questions/')) { 
          return 'Question Details | Q and A Platform'; 
        }
        if (pathname.startsWith('/announcements/')) {
          return 'Announcement Detail | Q and A Platform';
        }
        if (pathname.startsWith('/profile/')) { 
          return 'User Profile | Q and A Platform';
        }
        if (pathname.startsWith('/edit-question/')) {
          return 'Edit Question | Q and A Platform';
        }
        
        return 'Q and A Platform';
    }
  };
 
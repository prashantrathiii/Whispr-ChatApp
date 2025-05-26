export const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.toMillis !== 'function') return '';
    const date = new Date(timestamp.toMillis());
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  export const generateKey = () => {
    return Math.random().toString(36).substr(2, 10);
  };
  
  export const sortMessagesByTimestamp = (messages) => {
    return messages.sort((a, b) => {
      const aTime = a.timestamp?.toMillis?.() ?? 0;
      const bTime = b.timestamp?.toMillis?.() ?? 0;
      return aTime - bTime;
    });
  };
  
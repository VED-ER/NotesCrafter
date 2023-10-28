export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return date.toLocaleString(undefined, options || {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
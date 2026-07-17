/**
 * Utility to generate and download a vCard (.vcf) file for a contact.
 * This format is native to iOS and Android, allowing direct contact saving.
 */
export const downloadVcard = (profile) => {
  if (!profile) return;

  const {
    name = '',
    title = '',
    company = '',
    phone = '',
    email = '',
    website = '',
    address = '',
    bio = '',
    socials = {}
  } = profile;

  // Build vCard lines
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${name.split(' ').reverse().join(';')};;;`,
  ];

  if (company) lines.push(`ORG:${company}`);
  if (title) lines.push(`TITLE:${title}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  if (email) lines.push(`EMAIL;TYPE=PREF,INTERNET:${email}`);
  if (website) lines.push(`URL:${website}`);
  if (address) lines.push(`ADR;TYPE=WORK:;;${address.replace(/\n/g, ' ')};;;`);
  
  // Combine bio and social links into NOTE
  let noteParts = [];
  if (bio) noteParts.push(bio);
  
  const socialLinks = Object.entries(socials)
    .filter(([_, url]) => url)
    .map(([platform, url]) => `${platform.toUpperCase()}: ${url}`);
    
  if (socialLinks.length > 0) {
    noteParts.push('Social Links:\n' + socialLinks.join('\n'));
  }
  
  if (noteParts.length > 0) {
    lines.push(`NOTE:${noteParts.join('\n\n').replace(/\n/g, '\\n')}`);
  }

  lines.push('END:VCARD');

  const vcardContent = lines.join('\r\n');
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${name.replace(/\s+/g, '_')}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

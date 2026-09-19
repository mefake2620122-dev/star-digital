const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve(__dirname, 'dev.db')}`,
    },
  },
});

async function main() {
  console.log('Updating Star Digital database with Justdial verified details...');

  // 1. Business Contact
  await prisma.businessContact.upsert({
    where: { id: 'primary-contact' },
    update: {
      phone: '+91 90350 85031',
      whatsapp: '+919035085031',
      address: 'Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur, Uttar Pradesh 208001, India',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      latitude: 26.488533,
      longitude: 80.3328664,
      mapQuery: 'Star+Digital+Near+Elgin+Mill+Civil+Lines+Kanpur',
    },
    create: {
      id: 'primary-contact',
      name: 'STAR DIGITAL',
      phone: '+91 90350 85031',
      whatsapp: '+919035085031',
      email: 'support@stardigital.in',
      address: 'Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur, Uttar Pradesh 208001, India',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      latitude: 26.488533,
      longitude: 80.3328664,
      mapQuery: 'Star+Digital+Near+Elgin+Mill+Civil+Lines+Kanpur',
      active: true,
    },
  });

  // 2. CMS siteContent updates
  const cmsUpdates = [
    { key: 'contact_phone', value: '+91 90350 85031', label: 'Primary Contact Phone', type: 'phone', group: 'contact' },
    { key: 'contact_whatsapp', value: '+919035085031', label: 'WhatsApp Number', type: 'phone', group: 'contact' },
    { key: 'contact_address', value: 'Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur - 208001, Uttar Pradesh', label: 'Workshop & Office Address', type: 'text', group: 'contact' },
    { key: 'hero_tagline', value: 'Kanpur’s Trusted TV & Appliance Repair Center Since 2014', label: 'Hero Tagline', type: 'text', group: 'hero' },
    { key: 'hero_badge', value: 'Near Elgin Mill, Civil Lines, Kanpur', label: 'Hero Top Pill Badge', type: 'text', group: 'hero' },
    { key: 'about_experience', value: '13+ Years in Business (Established 2014)', label: 'Experience Years', type: 'text', group: 'about' },
  ];

  for (const item of cmsUpdates) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  // 3. Clear and seed authentic Workshop Photos
  await prisma.photo.deleteMany({});
  
  const jdPhotos = [
    {
      title: 'Star Digital Workshop & Diagnosis Lab',
      caption: 'Main service center and diagnostic testing bench for LED/LCD TV panels, motherboards & appliance electronics.',
      imageUrl: 'https://content3.jdmagicbox.com/v2/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-w1cywyefr7.jpg',
      category: 'repair',
      location: 'Near Elgin Mill, Civil Lines',
      sortOrder: 1,
      published: true,
    },
    {
      title: 'LED TV Display & Backlight Array Repair',
      caption: 'High-precision replacement of LED backlight strips and display diffuser sheets for 32" to 75" Smart TVs.',
      imageUrl: 'https://content3.jdmagicbox.com/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-jcwaqidh6x.jpg',
      category: 'repair',
      location: 'Civil Lines, Kanpur',
      sortOrder: 2,
      published: true,
    },
    {
      title: 'Smart TV Motherboard Component Soldering',
      caption: 'SMD capacitor, IC and power supply circuit repair with high-precision diagnostic testing.',
      imageUrl: 'https://content3.jdmagicbox.com/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-p1gv4nxnxf.jpg',
      category: 'repair',
      location: 'Maqbara Gwaltoli, Kanpur',
      sortOrder: 3,
      published: true,
    },
    {
      title: 'Doorstep Television Inspection & Repair Unit',
      caption: 'On-site testing and calibration for Sony, Samsung, LG, Mi and all major smart TV brands.',
      imageUrl: 'https://content3.jdmagicbox.com/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-a53cjit4zb.jpg',
      category: 'repair',
      location: 'Civil Lines, Kanpur',
      sortOrder: 4,
      published: true,
    },
    {
      title: 'Inverter Refrigerator & Compressor Diagnostics',
      caption: 'High pressure manifold gauge gas refill, relay starter test and thermostat repair.',
      imageUrl: 'https://content3.jdmagicbox.com/v2/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-x39c9rer1a.jpg',
      category: 'refrigerator',
      location: 'Civil Lines, Kanpur',
      sortOrder: 5,
      published: true,
    },
    {
      title: 'Front & Top Load Washing Machine Mechanical Repair',
      caption: 'Drum bearing alignment, inlet valve testing, and digital motor drive servicing.',
      imageUrl: 'https://content.jdmagicbox.com/v2/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-i9wlvletno.jpg',
      category: 'washing_machine',
      location: 'Civil Lines, Kanpur',
      sortOrder: 6,
      published: true,
    },
    {
      title: 'Split AC Chemical Jet Servicing & Coil Cleaning',
      caption: 'High-power pressure pump servicing for indoor cooling fins and outdoor condenser unit.',
      imageUrl: 'https://content.jdmagicbox.com/v2/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-lm4xnnzwoo.jpg',
      category: 'ac',
      location: 'Civil Lines, Kanpur',
      sortOrder: 7,
      published: true,
    },
    {
      title: 'Star Digital Certified Technician on Duty',
      caption: 'Experienced technicians carrying original manufacturer parts, diagnostic tools and equipment.',
      imageUrl: 'https://content.jdmagicbox.com/v2/comp/kanpur/d7/0512px512.x512.230506144742.n3d7/catalogue/star-digital-civil-lines-kanpur-tv-repair-and-services-vl10cr6p6y.jpg',
      category: 'repair',
      location: 'Near Elgin Mill, Civil Lines',
      sortOrder: 8,
      published: true,
    },
  ];

  await prisma.photo.createMany({ data: jdPhotos });
  console.log('Successfully updated 8 Justdial photos, business contact, and CMS data in SQLite!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

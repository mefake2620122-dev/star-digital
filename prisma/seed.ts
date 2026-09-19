import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import path from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve(__dirname, 'dev.db')}`,
    },
  },
})

async function main() {
  console.log('Seeding Star Digital database...')

  // 0. Admin User (reads from environment if configured)
  const initialAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123'
  const adminPasswordHash = await bcrypt.hash(initialAdminPassword, 10)
  await prisma.user.upsert({
    where: { email: 'admin@stardigital.in' },
    update: {
      username: 'admin',
    },
    create: {
      email: 'admin@stardigital.in',
      username: 'admin',
      name: 'Star Digital Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  // 1. Business Contact
  await prisma.businessContact.upsert({
    where: { id: 'primary-contact' },
    update: {},
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
      mapQuery: 'Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001',
      active: true,
    },
  })

  // 2. Services, Categories & Issues
  const servicesData = [
    {
      slug: 'ac',
      name: 'Air Conditioner (AC)',
      tagline: 'Expert AC Repair, Jet Servicing & Installation',
      shortDesc: 'Certified doorstep repair and chemical jet servicing for all Split, Window, and Inverter AC brands in Kanpur.',
      description: 'STAR DIGITAL delivers specialized doorstep air conditioner repair, preventive maintenance, and professional installation. Whether your AC is blowing room-temperature air, dripping water indoors, or tripping the circuit breaker, our technicians diagnose the root issue with transparent diagnostics.',
      icon: 'Wind',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 1,
      categories: [
        { name: 'Split AC', description: 'Comprehensive diagnostics, high-pressure foam jet cleaning, indoor/outdoor unit repair.' },
        { name: 'Window AC', description: 'Deep coil cleaning, fan motor repair, thermostat replacement, chassis vibration dampening.' },
        { name: 'Inverter AC', description: 'Specialized PCB circuit board repair, variable compressor testing, sensor replacements.' },
      ],
      issues: [
        { name: 'AC not cooling / Low cooling', description: 'Airflow is blowing but room is not getting cold.', commonIssue: true, sortOrder: 1 },
        { name: 'Water leakage / Dripping inside', description: 'Condensation tray overflow or blocked drainage pipe.', commonIssue: true, sortOrder: 2 },
        { name: 'Unusual noise / Vibration', description: 'Blower fan motor bearing issue or loose mounting.', commonIssue: true, sortOrder: 3 },
        { name: 'AC not starting / Dead power', description: 'Power supply failure, fuse blown, or PCB motherboard issue.', commonIssue: true, sortOrder: 4 },
        { name: 'Gas leakage / Low gas level', description: 'Refrigerant pressure drop requiring leak test and gas charging.', commonIssue: true, sortOrder: 5 },
        { name: 'Foul smell / Poor airflow', description: 'Clogged cooling fins and blower cylinder requiring deep jet wash.', commonIssue: true, sortOrder: 6 },
      ],
    },
    {
      slug: 'refrigerator',
      name: 'Refrigerator',
      tagline: 'Precision Fridge Cooling & Compressor Diagnostics',
      shortDesc: 'Doorstep repair for Single Door, Double Door, and Side-by-Side refrigerators. Resolving cooling failures and gas leaks.',
      description: 'A broken refrigerator threatens household groceries and food safety. Star Digital technicians provide rapid response across Kanpur for cooling drop-offs, freezer frost jams, thermostat irregularities, and inverter compressor failures.',
      icon: 'Refrigerator',
      image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 2,
      categories: [
        { name: 'Single Door Refrigerator', description: 'Defrost timer repair, capillary tube flushing, thermostat recalibration.' },
        { name: 'Double Door (Frost Free)', description: 'Bimetal sensor, defrost heater, evaporative fan, and PCB controller repairs.' },
        { name: 'Side-by-Side & Inverter', description: 'Dual evaporator diagnostics, inverter logic board testing, temperature zone repairs.' },
      ],
      issues: [
        { name: 'Fridge not cooling at all', description: 'Compressor not starting or total refrigerant loss.', commonIssue: true, sortOrder: 1 },
        { name: 'Freezer works but lower compartment warm', description: 'Damper flap stuck, defrost fan failed, or air duct blocked.', commonIssue: true, sortOrder: 2 },
        { name: 'Excessive frost build-up / Ice jamming', description: 'Defrost thermostat or defrost heater timer malfunction.', commonIssue: true, sortOrder: 3 },
        { name: 'Water leaking onto the floor', description: 'Drain pan cracked or defrost drain line clogged with debris.', commonIssue: true, sortOrder: 4 },
        { name: 'Clicking sound from back / Motor hot', description: 'Compressor starter relay capacitor issue.', commonIssue: true, sortOrder: 5 },
      ],
    },
    {
      slug: 'washing-machine',
      name: 'Washing Machine',
      tagline: 'Complete Drum, Drain & Motor Servicing',
      shortDesc: 'Rapid repair for Front Load, Top Load, and Semi-Automatic washing machines. Noise, drainage, and spin cycle specialists.',
      description: 'Keep your household laundry running smoothly. We resolve heavy spin-cycle vibrations, water inlet failures, drain pump clogs, error codes, and drum spider bearing damage with authentic spare replacements.',
      icon: 'Disc',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 3,
      categories: [
        { name: 'Front Load Automatic', description: 'Shock absorber replacement, spider arm repair, door lock latch, PCB programming.' },
        { name: 'Top Load Fully Automatic', description: 'Pulsator gear box repair, pressure sensor switch, suspension rod tuning.' },
        { name: 'Semi-Automatic', description: 'Spin motor rewinding, wash timer switch, drain valve seal replacement.' },
      ],
      issues: [
        { name: 'Washing machine not spinning / Drum stuck', description: 'Drive belt snapped, motor capacitor weak, or gear assembly jammed.', commonIssue: true, sortOrder: 1 },
        { name: 'Water not draining out / Drain error', description: 'Drain pump clogged or drain valve actuator burnt.', commonIssue: true, sortOrder: 2 },
        { name: 'Violent shaking / High vibration & noise', description: 'Worn suspension shock absorbers or uncalibrated leveling feet.', commonIssue: true, sortOrder: 3 },
        { name: 'Water overflowing / Continuously filling', description: 'Pressure water-level sensor switch defect.', commonIssue: true, sortOrder: 4 },
        { name: 'Machine not powering on / Error on display', description: 'Main electronic controller or door safety switch interlock.', commonIssue: true, sortOrder: 5 },
      ],
    },
    {
      slug: 'led-lcd-tv',
      name: 'LED / LCD TV',
      tagline: 'Display Panel, Motherboard & Sound Restoration',
      shortDesc: 'Component-level repair for LED, LCD, QLED, and Smart 4K TVs. Backlight replacement and wall mounting.',
      description: 'Star Digital restores your entertainment experience without requiring you to transport heavy TVs across the city. We diagnose backlight strip burns, sound failures, HDMI port faults, and display flickering directly at your home in Kanpur.',
      icon: 'Tv',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 4,
      categories: [
        { name: 'Smart LED TV', description: 'Backlight LED strip arrays, WiFi module, and Android firmware recovery.' },
        { name: '4K OLED / QLED TV', description: 'T-Con board timing calibration, motherboard power rails, audio IC repair.' },
        { name: 'Wall Mounting & Setup', description: 'Precision heavy-duty bracket installation, concealing cables, and angle alignment.' },
      ],
      issues: [
        { name: 'Sound working but screen is black / No display', description: 'LED backlight array burnt out or backlight inverter driver dead.', commonIssue: true, sortOrder: 1 },
        { name: 'TV completely dead / No standby red light', description: 'Power supply board (SMPS) failure or capacitor burst.', commonIssue: true, sortOrder: 2 },
        { name: 'Horizontal or vertical colored lines on screen', description: 'T-Con board fault or panel COF ribbon tape bonding issue.', commonIssue: true, sortOrder: 3 },
        { name: 'Sound distorted or no audio output', description: 'Audio amplifier IC chip or internal stereo speakers blown.', commonIssue: true, sortOrder: 4 },
        { name: 'Professional wall mount installation', description: 'Secure mounting on brick/concrete walls with leveling check.', commonIssue: true, sortOrder: 5 },
      ],
    },
    {
      slug: 'cctv',
      name: 'CCTV Security Systems',
      tagline: 'High-Definition Surveillance Setup & Maintenance',
      shortDesc: 'Professional CCTV security camera installation, DVR/NVR configuration, and mobile live-view setup for Kanpur homes & shops.',
      description: 'Protect your family and commercial premises with high-resolution surveillance systems. We provide wiring, camera mounting, DVR hard drive repairs, night-vision infrared calibration, and remote mobile viewing setup.',
      icon: 'Camera',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 5,
      categories: [
        { name: 'HD Analog & IP Cameras', description: 'Indoor dome cameras, weather-proof outdoor bullet cameras, color night-vision.' },
        { name: 'DVR / NVR Recording Stations', description: 'Hard disk storage setup, scheduled recording, motion detection alerts.' },
        { name: 'Mobile Remote View Configuration', description: 'Router port forwarding, cloud P2P app synchronization on smartphones.' },
      ],
      issues: [
        { name: 'Camera showing "No Video" / Blank channel', description: 'BNC/RJ45 connector loose, SMPS power adapter failure, or cable cut.', commonIssue: true, sortOrder: 1 },
        { name: 'Night vision IR not working / Pitch black', description: 'Infrared LED board burnt or light sensor stuck.', commonIssue: true, sortOrder: 2 },
        { name: 'DVR not recording / Hard disk error beep', description: 'SATA surveillance hard disk failure or format error.', commonIssue: true, sortOrder: 3 },
        { name: 'Cannot view cameras on phone / Offline status', description: 'Network switch failure or IP cloud configuration mismatch.', commonIssue: true, sortOrder: 4 },
        { name: 'New CCTV system complete installation', description: 'End-to-end wiring, camera positioning, and DVR commissioning.', commonIssue: true, sortOrder: 5 },
      ],
    },
    {
      slug: 'other',
      name: 'Other Home Appliances',
      tagline: 'Microwaves, Water Purifiers & Geysers',
      shortDesc: 'Trusted doorstep maintenance for Microwave Ovens, RO Water Purifiers, and Electric Water Heaters across Kanpur.',
      description: 'Comprehensive maintenance for essential household electronics. From non-heating microwaves and tripped geyser elements to clogged RO membrane filters, Star Digital keeps your home operating seamlessly.',
      icon: 'Sliders',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 6,
      categories: [
        { name: 'Microwave Oven', description: 'Magnetron tube, high voltage diode, turntable motor, touch membrane keypad.' },
        { name: 'RO Water Purifier', description: 'Booster pump repair, sediment & carbon filter replacement, TDS calibration.' },
        { name: 'Electric Geyser', description: 'Heating element scale cleaning, thermostat cutoff, safety pressure valve.' },
      ],
      issues: [
        { name: 'Microwave turns on but does not heat food', description: 'Magnetron failure or high-voltage capacitor blown.', commonIssue: true, sortOrder: 1 },
        { name: 'Microwave sparking inside chamber', description: 'Mica waveguide cover plate burnt with grease splatter.', commonIssue: true, sortOrder: 2 },
        { name: 'RO water flow extremely slow / Taste change', description: 'Clogged sediment pre-filters or exhausted RO membrane.', commonIssue: true, sortOrder: 3 },
        { name: 'Geyser water not heating / Tripping MCB', description: 'Heating coil corroded causing electrical earthing short-circuit.', commonIssue: true, sortOrder: 4 },
      ],
    },
  ]

  for (const s of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        tagline: s.tagline,
        shortDesc: s.shortDesc,
        description: s.description,
        icon: s.icon,
        image: s.image,
        sortOrder: s.sortOrder,
      },
      create: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        shortDesc: s.shortDesc,
        description: s.description,
        icon: s.icon,
        image: s.image,
        sortOrder: s.sortOrder,
      },
    })

    await prisma.serviceCategory.deleteMany({ where: { serviceId: service.id } })
    await prisma.serviceIssue.deleteMany({ where: { serviceId: service.id } })

    for (const c of s.categories) {
      await prisma.serviceCategory.create({
        data: {
          serviceId: service.id,
          name: c.name,
          description: c.description,
        },
      })
    }

    for (const iss of s.issues) {
      await prisma.serviceIssue.create({
        data: {
          serviceId: service.id,
          name: iss.name,
          description: iss.description,
          commonIssue: iss.commonIssue,
          sortOrder: iss.sortOrder,
        },
      })
    }
  }

  // 3. Kanpur Service Areas
  const serviceAreasData = [
    { name: 'Civil Lines (Power House Area)', district: 'Kanpur Central', pincode: '208001', estimatedArrivalMins: 45, sortOrder: 1 },
    { name: 'Swaroop Nagar', district: 'Kanpur Central', pincode: '208002', estimatedArrivalMins: 60, sortOrder: 2 },
    { name: 'Mall Road', district: 'Kanpur Central', pincode: '208001', estimatedArrivalMins: 60, sortOrder: 3 },
    { name: 'Kakadeo', district: 'Kanpur West', pincode: '208025', estimatedArrivalMins: 75, sortOrder: 4 },
    { name: 'Kidwai Nagar', district: 'Kanpur South', pincode: '208011', estimatedArrivalMins: 90, sortOrder: 5 },
    { name: 'Govind Nagar', district: 'Kanpur South', pincode: '208006', estimatedArrivalMins: 90, sortOrder: 6 },
    { name: 'Shyam Nagar', district: 'Kanpur East', pincode: '208013', estimatedArrivalMins: 90, sortOrder: 7 },
    { name: 'Kalyanpur', district: 'Kanpur North', pincode: '208017', estimatedArrivalMins: 90, sortOrder: 8 },
    { name: 'Harsh Nagar', district: 'Kanpur Central', pincode: '208012', estimatedArrivalMins: 60, sortOrder: 9 },
    { name: 'Tilak Nagar', district: 'Kanpur Central', pincode: '208002', estimatedArrivalMins: 60, sortOrder: 10 },
    { name: 'Barra', district: 'Kanpur South', pincode: '208027', estimatedArrivalMins: 90, sortOrder: 11 },
  ]

  await prisma.serviceArea.deleteMany()
  for (const area of serviceAreasData) {
    await prisma.serviceArea.create({ data: area })
  }

  // 4. Reviews
  const reviewsData = [
    {
      customerName: 'A. K. Sharma',
      area: 'Civil Lines, Kanpur',
      rating: 5,
      review: 'My inverter split AC had stopped cooling during peak summer heat. Star Digital technician arrived promptly at our Civil Lines home, diagnosed the capacitor fault, and had it running in under an hour.',
      isPlaceholder: true,
      sortOrder: 1,
    },
    {
      customerName: 'Priya Verma',
      area: 'Swaroop Nagar, Kanpur',
      rating: 5,
      review: 'Very professional washing machine drum repair. The technician gave an honest diagnostic before touching anything and replaced the worn shock absorbers cleanly.',
      isPlaceholder: true,
      sortOrder: 2,
    },
    {
      customerName: 'Rajesh Gupta',
      area: 'Kakadeo, Kanpur',
      rating: 5,
      review: 'Got our 55-inch LED TV display repaired when the screen went blank. Star Digital tested the backlight strips at our residence and restored display clarity without any hassle.',
      isPlaceholder: true,
      sortOrder: 3,
    },
  ]

  await prisma.review.deleteMany()
  for (const rev of reviewsData) {
    await prisma.review.create({ data: rev })
  }

  // 5. Frequently Asked Questions
  const faqsData = [
    {
      question: 'How quickly can a technician visit my location in Kanpur?',
      answer: 'For primary locations like Civil Lines and Power House areas, our technicians typically arrive within 45 to 60 minutes of booking confirmation. Other Kanpur sectors receive service within 90 minutes or at your scheduled preferred time slot.',
      category: 'general',
      sortOrder: 1,
    },
    {
      question: 'Do you charge an inspection fee if I proceed with the repair?',
      answer: 'Our diagnostic inspection fee is minimal and is adjusted against your final repair bill if you choose to proceed with the service.',
      category: 'general',
      sortOrder: 2,
    },
    {
      question: 'Do you repair all brands of air conditioners and refrigerators?',
      answer: 'Yes, our technicians service all major Indian and international appliance brands including LG, Samsung, Daikin, Voltas, Godrej, Whirlpool, Haier, Hitachi, and Blue Star.',
      category: 'general',
      sortOrder: 3,
    },
    {
      question: 'Are repairs performed at my home or taken to a workshop?',
      answer: 'Over 90% of repairs—including AC servicing, fridge gas recharging, washing machine belts, and TV backlights—are executed right in front of you at your home. Complex circuit board micro-soldering may require short workshop testing with customer consent.',
      category: 'general',
      sortOrder: 4,
    },
    {
      question: 'How can I pay for the service?',
      answer: 'We accept all convenient modes: UPI (Google Pay, PhonePe, Paytm), cash on service completion, or bank transfer.',
      category: 'general',
      sortOrder: 5,
    },
  ]

  await prisma.fAQ.deleteMany()
  for (const faq of faqsData) {
    await prisma.fAQ.create({ data: faq })
  }

  // 6. Site Settings
  const settingsData = [
    { key: 'OPERATING_HOURS', value: '8:00 AM – 9:00 PM (Monday – Sunday)', description: 'Customer service operating hours' },
    { key: 'EMERGENCY_SUPPORT', value: 'Same-day urgent dispatch available for refrigerator breakdowns', description: 'Urgent service availability' },
    { key: 'SERVICE_WARRANTY_NOTE', value: 'Standard 30-day service warranty on replaced spare parts and workmanship', description: 'Warranty policy' },
  ]

  for (const sett of settingsData) {
    await prisma.siteSettings.upsert({
      where: { key: sett.key },
      update: { value: sett.value },
      create: sett,
    })
  }

  // 7. Site Content CMS — editable elements from Admin Panel
  const initialContent = [
    { key: 'hero_badge', value: 'Kanpur Doorstep Appliance Care', label: 'Hero Top Badge', type: 'text', group: 'hero' },
    { key: 'hero_title', value: 'Expert Appliance Repair. Right At Your Doorstep.', label: 'Hero Main Title', type: 'text', group: 'hero' },
    { key: 'hero_subtitle', value: 'Certified doorstep repair for AC, Refrigerator, Washing Machine, LED TV, CCTV, and Home Appliances in Kanpur. Transparent pricing & 30-day warranty.', label: 'Hero Subtitle', type: 'text', group: 'hero' },
    { key: 'hero_image', value: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80', label: 'Hero Cover Image', type: 'image_url', group: 'hero' },
    { key: 'business_phone', value: '+91 98390 12345', label: 'Primary Helpline Phone', type: 'phone', group: 'contact' },
    { key: 'business_whatsapp', value: '+919839012345', label: 'WhatsApp Number (with country code)', type: 'phone', group: 'contact' },
    { key: 'business_email', value: 'support@stardigital.in', label: 'Support Email', type: 'text', group: 'contact' },
    { key: 'business_address', value: 'Civil Lines, Power House, Kanpur, Uttar Pradesh 208001, India', label: 'Store / Service Hub Address', type: 'text', group: 'contact' },
    { key: 'operating_hours', value: '8:00 AM – 9:00 PM (Monday – Sunday)', label: 'Working Hours', type: 'text', group: 'contact' },
    { key: 'warranty_guarantee', value: '30-Day Service Guarantee with Genuine Spare Parts', label: 'Warranty & Guarantee Badge', type: 'text', group: 'general' },
    { key: 'about_story', value: 'STAR DIGITAL was established to bring transparent, high-precision electronic and home appliance doorstep repair to families and commercial establishments across Kanpur.', label: 'About Us Summary', type: 'text', group: 'about' },
    { key: 'footer_tagline', value: 'Kanpur\'s most trusted doorstep appliance repair partner. Serving Civil Lines, Swaroop Nagar, Kakadeo, Kidwai Nagar, and across Kanpur.', label: 'Footer Tagline', type: 'text', group: 'footer' },
  ]

  for (const item of initialContent) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value, label: item.label, type: item.type, group: item.group },
      create: item,
    })
  }

  console.log('Star Digital database seeded successfully with SiteContent CMS!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

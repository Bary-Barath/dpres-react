/** @type {import('../types/resource').ResourceEntry[]} */
export const RESOURCE_LOCATIONS = [
  {
    id: 'fire-extinguisher',
    name: 'Fire Extinguishers',
    count: 18,
    color: '#EF4444',
    status: 'Adequate',
    locations: [
      { id: 'fe-1', building: 'Block A', floor: 'Ground Floor', room: 'A-101 Corridor', description: 'Near main entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-2', building: 'Block A', floor: 'Ground Floor', room: 'A-102 Corridor', description: 'Staircase landing', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-3', building: 'Block B', floor: 'Ground Floor', room: 'B-101', description: 'Chemistry Lab Entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-4', building: 'Block B', floor: 'First Floor', room: 'B-201 Staircase', description: 'Staircase area', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-5', building: 'Block C', floor: 'Ground Floor', room: 'C-101', description: 'Administration Wing', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-6', building: 'Library', floor: 'Ground Floor', room: 'L-101 Corridor', description: 'Library main corridor', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-7', building: 'Canteen', floor: 'Ground Floor', room: 'K-01', description: 'Kitchen entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-8', building: 'Block A', floor: 'Second Floor', room: 'A-201 Corridor', description: 'Near lecture hall', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-9', building: 'Block B', floor: 'Second Floor', room: 'B-202', description: 'Biology Lab entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-10', building: 'Block A', floor: 'Third Floor', room: 'A-301', description: 'Server room adjacent', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-11', building: 'Block C', floor: 'First Floor', room: 'C-201', description: 'Conference room area', status: 'Maintenance', latitude: null, longitude: null },
      { id: 'fe-12', building: 'Library', floor: 'First Floor', room: 'L-201', description: 'Digital lab area', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-13', building: 'Block A', floor: 'Ground Floor', room: 'A-103', description: 'Ground floor hallway', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-14', building: 'Block B', floor: 'Ground Floor', room: 'B-102', description: 'Physics lab entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-15', building: 'Block C', floor: 'Ground Floor', room: 'C-102', description: 'Reception area', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-16', building: 'Canteen', floor: 'First Floor', room: 'K-101', description: 'Event hall area', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-17', building: 'Block A', floor: 'First Floor', room: 'A-201', description: 'Staff room corridor', status: 'Available', latitude: null, longitude: null },
      { id: 'fe-18', building: 'Library', floor: 'Ground Floor', room: 'L-102', description: 'Periodicals section', status: 'Available', latitude: null, longitude: null }
    ]
  },
  {
    id: 'emergency-exit',
    name: 'Emergency Exits',
    count: 14,
    color: '#3B82F6',
    status: 'Adequate',
    locations: [
      { id: 'ee-1', building: 'Block A', floor: 'Ground Floor', room: 'North Wing Exit', description: 'Main north entrance', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-2', building: 'Block A', floor: 'Ground Floor', room: 'South Wing Exit', description: 'South staircase exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-3', building: 'Block B', floor: 'Ground Floor', room: 'East Exit', description: 'Science block east door', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-4', building: 'Block B', floor: 'Ground Floor', room: 'West Exit', description: 'Science block west door', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-5', building: 'Block C', floor: 'Ground Floor', room: 'Admin Exit', description: 'Administration main exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-6', building: 'Library', floor: 'Ground Floor', room: 'Library Exit', description: 'Main library door', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-7', building: 'Canteen', floor: 'Ground Floor', room: 'Canteen Exit', description: 'Food court main exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-8', building: 'Block A', floor: 'First Floor', room: 'A Stairwell 1', description: 'North stairwell fire exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-9', building: 'Block A', floor: 'First Floor', room: 'A Stairwell 2', description: 'South stairwell fire exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-10', building: 'Block B', floor: 'First Floor', room: 'B Stairwell', description: 'Lab block stairwell exit', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-11', building: 'Block C', floor: 'First Floor', room: 'C Stairwell', description: 'Admin block stairwell', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-12', building: 'Block A', floor: 'Second Floor', room: 'A Stairwell 1', description: 'North stairwell 2F', status: 'Available', latitude: null, longitude: null },
      { id: 'ee-13', building: 'Block B', floor: 'Second Floor', room: 'B Stairwell', description: 'Lab block stairwell 2F', status: 'Maintenance', latitude: null, longitude: null },
      { id: 'ee-14', building: 'Library', floor: 'First Floor', room: 'Library Rear Exit', description: 'Rear emergency exit', status: 'Available', latitude: null, longitude: null }
    ]
  },
  {
    id: 'assembly-point',
    name: 'Assembly Points',
    count: 5,
    color: '#F97316',
    status: 'Adequate',
    locations: [
      { id: 'ap-1', building: 'Open Ground', floor: 'Outdoor', room: 'Main Ground', description: 'Primary assembly point — capacity 600', status: 'Available', latitude: null, longitude: null },
      { id: 'ap-2', building: 'Sports Complex', floor: 'Outdoor', room: 'Basketball Court', description: 'Secondary assembly point — capacity 250', status: 'Available', latitude: null, longitude: null },
      { id: 'ap-3', building: 'Main Gate Area', floor: 'Outdoor', room: 'Parking Area', description: 'Overflow assembly — capacity 150', status: 'Available', latitude: null, longitude: null },
      { id: 'ap-4', building: 'Block C', floor: 'Outdoor', room: 'Admin Lawn', description: 'Admin block assembly point', status: 'Available', latitude: null, longitude: null },
      { id: 'ap-5', building: 'Library', floor: 'Outdoor', room: 'Library Garden', description: 'Library block assembly point', status: 'Available', latitude: null, longitude: null }
    ]
  },
  {
    id: 'first-aid-kit',
    name: 'First Aid Kits',
    count: 28,
    color: '#10B981',
    status: 'Well Stocked',
    locations: [
      { id: 'fa-1', building: 'Block C', floor: 'Ground Floor', room: 'Medical Room', description: 'Fully equipped medical room', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-2', building: 'Block C', floor: 'Ground Floor', room: 'Admin Office', description: 'Reception desk kit', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-3', building: 'Library', floor: 'Ground Floor', room: 'Library Office', description: 'Staff office first aid kit', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-4', building: 'Sports Complex', floor: 'Ground Floor', room: 'Sports Room', description: 'Sports complex first aid station', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-5', building: 'Block A', floor: 'Ground Floor', room: 'A-101', description: 'Ground floor common area', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-6', building: 'Block A', floor: 'First Floor', room: 'A-201 Staff Room', description: 'Staff room first aid', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-7', building: 'Block A', floor: 'Second Floor', room: 'A-301', description: 'Upper floor kit', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-8', building: 'Block B', floor: 'Ground Floor', room: 'B-101', description: 'Science block ground floor', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-9', building: 'Block B', floor: 'First Floor', room: 'B-201 Prep Room', description: 'Lab prep room kit', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-10', building: 'Block B', floor: 'Second Floor', room: 'B-301', description: 'Workshop area kit', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-11', building: 'Canteen', floor: 'Ground Floor', room: 'K-01 Counter', description: 'Food court first aid', status: 'Available', latitude: null, longitude: null },
      { id: 'fa-12', building: 'Block C', floor: 'First Floor', room: 'C-201 HR Dept', description: 'HR department kit', status: 'Available', latitude: null, longitude: null }
    ]
  },
  {
    id: 'emergency-alarm',
    name: 'Emergency Alarms',
    count: 10,
    color: '#8B5CF6',
    status: 'Functional',
    locations: [
      { id: 'ea-1', building: 'Block A', floor: 'Ground Floor', room: 'A Block Entrance', description: 'Main entrance alarm panel', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-2', building: 'Block A', floor: 'First Floor', room: 'A-201 Corridor', description: 'First floor hallway alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-3', building: 'Block A', floor: 'Second Floor', room: 'A-301 Corridor', description: 'Second floor hallway alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-4', building: 'Block B', floor: 'Ground Floor', room: 'B Block Entrance', description: 'Science block entrance alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-5', building: 'Block B', floor: 'First Floor', room: 'B-201 Corridor', description: 'Lab block first floor alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-6', building: 'Block C', floor: 'Ground Floor', room: 'C Block Entrance', description: 'Admin block main alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-7', building: 'Library', floor: 'Ground Floor', room: 'L Block Entrance', description: 'Library entrance alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-8', building: 'Canteen', floor: 'Ground Floor', room: 'K Block Entrance', description: 'Canteen entrance alarm', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-9', building: 'Block A', floor: 'Third Floor', room: 'A-401 Corridor', description: 'Top floor alarm near server room', status: 'Available', latitude: null, longitude: null },
      { id: 'ea-10', building: 'Block C', floor: 'First Floor', room: 'C-201 Corridor', description: 'Admin first floor alarm', status: 'Maintenance', latitude: null, longitude: null }
    ]
  },
  {
    id: 'spare-extinguisher',
    name: 'Spare Extinguishers',
    count: 9,
    color: '#EAB308',
    status: 'Spare Units',
    locations: [
      { id: 'se-1', building: 'Block C', floor: 'Ground Floor', room: 'Maintenance Room', description: 'Central maintenance storage', status: 'Available', latitude: null, longitude: null },
      { id: 'se-2', building: 'Block A', floor: 'Ground Floor', room: 'Safety Storage Room', description: 'Block A safety supply room', status: 'Available', latitude: null, longitude: null },
      { id: 'se-3', building: 'Block B', floor: 'Ground Floor', room: 'B-Storage', description: 'Science block storage', status: 'Available', latitude: null, longitude: null },
      { id: 'se-4', building: 'Library', floor: 'Ground Floor', room: 'L-Storage', description: 'Library utility room', status: 'Available', latitude: null, longitude: null },
      { id: 'se-5', building: 'Canteen', floor: 'Ground Floor', room: 'K-Storage', description: 'Canteen storage room', status: 'Available', latitude: null, longitude: null },
      { id: 'se-6', building: 'Block C', floor: 'Ground Floor', room: 'Security Room', description: 'Security post spares', status: 'Available', latitude: null, longitude: null },
      { id: 'se-7', building: 'Block A', floor: 'Second Floor', room: 'A-Utility Room', description: 'Upper floor utility closet', status: 'Available', latitude: null, longitude: null },
      { id: 'se-8', building: 'Block B', floor: 'Second Floor', room: 'B-Utility Room', description: 'Lab block utility room', status: 'Available', latitude: null, longitude: null },
      { id: 'se-9', building: 'Block C', floor: 'Ground Floor', room: 'Records Storage', description: 'Records room spare unit', status: 'Available', latitude: null, longitude: null }
    ]
  }
];

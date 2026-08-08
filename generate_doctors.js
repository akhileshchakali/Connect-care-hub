import fs from 'fs';
import path from 'path';

const firstNames = [
  "Ramesh", "Suresh", "Mahesh", "Rajesh", "Kiran", "Priya", "Sneha", "Anjali", "Neha", "Pooja",
  "Ravi", "Sanjay", "Amit", "Rahul", "Vivek", "Arun", "Sunil", "Anil", "Deepak", "Manoj",
  "Prasad", "Srikanth", "Venkatesh", "Srinivas", "Krishna", "Ram", "Lakshman", "Bharath", "Satish", "Prakash",
  "Radha", "Lakshmi", "Saraswathi", "Parvathi", "Sandhya", "Kavitha", "Swathi", "Divya", "Bhavya", "Nithya",
  "Arvind", "Naveen", "Praveen", "Kalyan", "Chaitanya", "Aditya", "Abhinav", "Varun", "Tarun", "Siddharth",
  "Harsha", "Phani", "Vamsi", "Sudhir", "Gopi", "Madhu", "Sridhar", "Prabhakar", "Sudhakar", "Pratap"
];

const lastNames = [
  "Reddy", "Rao", "Naidu", "Choudary", "Sharma", "Varma", "Kumar", "Singh", "Patil", "Desai",
  "Kulkarni", "Joshi", "Iyer", "Nair", "Menon", "Pillai", "Das", "Bose", "Sen", "Gupta",
  "Agarwal", "Bansal", "Garg", "Jain", "Shah", "Patel", "Mehta", "Bhatia", "Ahuja", "Kapoor",
  "Goud", "Yadav", "Chary", "Raju", "Babu", "Mishra", "Pandey", "Shukla", "Tiwari", "Dubey"
];

const specialties = [
  "Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Oncology",
  "Pediatrics", "Dermatology", "Psychiatry", "Endocrinology", "Ophthalmology",
  "ENT", "Urology", "Nephrology", "Pulmonology", "Rheumatology",
  "General Medicine", "General Surgery", "Obstetrics & Gynecology", "Plastic Surgery", "Dentistry"
];

const hospitals = [
  "Apollo Hospitals, Jubilee Hills, Hyderabad",
  "Yashoda Hospitals, Secunderabad, Hyderabad",
  "AIG Hospitals, Gachibowli, Hyderabad",
  "Care Hospitals, Banjara Hills, Hyderabad",
  "KIMS Hospitals, Secunderabad, Hyderabad",
  "Continental Hospitals, Gachibowli, Hyderabad",
  "Medicover Hospitals, Hitec City, Hyderabad",
  "Aster Prime Hospital, Ameerpet, Hyderabad",
  "Sunshine Hospitals, Paradise, Hyderabad",
  "Rainbow Children's Hospital, Banjara Hills, Hyderabad",
  "Virinchi Hospitals, Banjara Hills, Hyderabad",
  "Yashoda Hospitals, Somajiguda, Hyderabad",
  "Apollo DRDO Hospital, Kanchanbagh, Hyderabad",
  "KIMS Hospitals, Kondapur, Hyderabad",
  "Pace Hospitals, Hitech City, Hyderabad"
];

const existingDoctors = [
  { id: 1, name: 'Dr. D Nageshwar Reddy', specialty: 'Gastroenterology', location: 'AIG Hospitals, Gachibowli, Hyderabad', waitTime: '30 mins', queue: 4, fee: '₹500' },
  { id: 2, name: 'Dr. Sudhir Naik', specialty: 'Cardiology', location: 'Apollo Hospitals, Jubilee Hills, Hyderabad', waitTime: '15 mins', queue: 2, fee: '₹1000' },
  { id: 3, name: 'Dr. R. N. Komal Kumar', specialty: 'Neurology', location: 'Yashoda Hospitals, Secunderabad, Hyderabad', waitTime: '45 mins', queue: 6, fee: '₹800' },
  { id: 4, name: 'Dr. Tarakeswari Surapaneni', specialty: 'Obstetrics & Gynecology', location: 'Fernandez Hospital, Hyderabad', waitTime: '20 mins', queue: 3, fee: '₹800' },
  { id: 5, name: 'Dr. S Kiran Reddy', specialty: 'Orthopedics', location: 'Continental Hospitals, Gachibowli, Hyderabad', waitTime: '10 mins', queue: 1, fee: '₹1000' },
  { id: 6, name: 'Dr. Suresh H. Advani', specialty: 'Medical Oncology', location: 'Jaslok Hospital, Mumbai', waitTime: '60 mins', queue: 8, fee: '₹3000' },
  { id: 7, name: 'Dr. Ashwin Mehta', specialty: 'Interventional Cardiology', location: 'Jaslok Hospital, Mumbai', waitTime: '25 mins', queue: 3, fee: '₹2500' },
  { id: 8, name: 'Dr. Ankit Dalal', specialty: 'Gastroenterology', location: 'Nanavati Max Hospital, Mumbai', waitTime: '40 mins', queue: 5, fee: '₹1500' },
  { id: 9, name: 'Dr. Sanjay Agarwala', specialty: 'Orthopedics', location: 'P.D. Hinduja Hospital, Mumbai', waitTime: '15 mins', queue: 2, fee: '₹2500' },
  { id: 10, name: 'Dr. Pradyumna J. Oak', specialty: 'Neurology', location: 'Nanavati Max Hospital, Mumbai', waitTime: '35 mins', queue: 4, fee: '₹1800' },
  { id: 11, name: 'Dr. Ambrish Mithal', specialty: 'Endocrinology', location: 'Max Healthcare, Delhi', waitTime: '20 mins', queue: 3, fee: '₹2200' },
  { id: 12, name: 'Dr. Balbir Singh', specialty: 'Cardiology', location: 'Max Saket, Delhi', waitTime: '55 mins', queue: 7, fee: '₹2000' },
  { id: 13, name: 'Dr. R.S. Mishra', specialty: 'Internal Medicine', location: 'Fortis Vasant Kunj, Delhi', waitTime: '10 mins', queue: 1, fee: '₹1200' },
  { id: 14, name: 'Dr. Shubhra Gupta', specialty: 'Internal Medicine', location: 'Apollo Spectra, Chirag Enclave, Delhi', waitTime: '30 mins', queue: 4, fee: '₹1000' },
  { id: 15, name: 'Dr. (Prof.) Anil Arora', specialty: 'Orthopedics', location: 'Max Healthcare, Delhi', waitTime: '45 mins', queue: 6, fee: '₹1800' },
];

let nextId = 16;
const generatedDoctors = [];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

for (let i = 0; i < 110; i++) {
  const fName = getRandomElement(firstNames);
  const lName = getRandomElement(lastNames);
  const name = `Dr. ${fName} ${lName}`;
  const specialty = getRandomElement(specialties);
  const location = getRandomElement(hospitals);
  
  const waitTimeMins = getRandomInt(5, 90);
  const queue = Math.floor(waitTimeMins / 5) || 1;
  const waitTime = `${waitTimeMins} mins`;
  
  // Fees generally base 500 up to 2000 in chunks of 100
  const feeVal = Math.floor(getRandomInt(5, 20)) * 100;
  const fee = `₹${feeVal}`;

  generatedDoctors.push({
    id: nextId++,
    name,
    specialty,
    location,
    waitTime,
    queue,
    fee
  });
}

const allDoctors = [...existingDoctors, ...generatedDoctors];

const fileContent = `export const MOCK_DOCTORS = ${JSON.stringify(allDoctors, null, 2)};`;

const targetDir = './src/data';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'doctors.js'), fileContent);
console.log('Successfully generated doctors data!');

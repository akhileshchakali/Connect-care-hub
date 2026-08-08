import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Plus, Minus, Activity, Users, Droplet } from 'lucide-react';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import './Dashboard.css';

const INITIAL_INVENTORY = [
  { group: 'A+', units: 15 },
  { group: 'A-', units: 4 },
  { group: 'B+', units: 22 },
  { group: 'B-', units: 2 },
  { group: 'AB+', units: 8 },
  { group: 'AB-', units: 1 },
  { group: 'O+', units: 30 },
  { group: 'O-', units: 5 },
];

const Dashboard = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.units, 0);

  useEffect(() => {
    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, 'blood_inventory'), (snapshot) => {
      const fetchedInventory = snapshot.docs.map(doc => ({
        group: doc.id,
        ...doc.data()
      }));

      // If database is empty, we keep initial mock. Over time it will populate.
      if (fetchedInventory.length > 0) {
        // Sort to maintain order
        const sorted = [...fetchedInventory].sort((a, b) => a.group.localeCompare(b.group));
        setInventory(sorted);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async (group, increment) => {
    const item = inventory.find(i => i.group === group);
    const currentUnits = item ? item.units : 0;
    const newUnits = currentUnits + increment;
    const finalUnits = newUnits >= 0 ? newUnits : 0;

    // Optimistic UI update
    setInventory(prev => prev.map(invItem => 
      invItem.group === group ? { ...invItem, units: finalUnits } : invItem
    ));

    // Update real Firestore database
    try {
      await setDoc(doc(db, 'blood_inventory', group), { units: finalUnits }, { merge: true });
    } catch (error) {
      console.error("Error updating document: ", error);
      // Optional: rollback state here if needed
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="dashboard-header fade-in">
          <h1>City Hospital Details Overview</h1>
          <p>Manage blood inventory and monitor resource availability in real-time.</p>
        </div>

        <div className="stats-row fade-in">
          <div className="stat-card">
             <Droplet size={32} color="#ff3b3b" />
             <div className="stat-info">
               <h3>{totalUnits}</h3>
               <p>Total Blood Units</p>
             </div>
          </div>
          <div className="stat-card">
             <Activity size={32} color="#34c759" />
             <div className="stat-info">
               <h3>4 Critical</h3>
               <p>Low Stock Groups (B-, AB-)</p>
             </div>
          </div>
          <div className="stat-card">
             <Users size={32} color="#0071e3" />
             <div className="stat-info">
               <h3>12 Today</h3>
               <p>Donors Expected</p>
             </div>
          </div>
        </div>

        <div className="inventory-section fade-in">
          <h2>Blood Inventory Management</h2>
          <div className="inventory-grid">
            {inventory.map((item) => (
              <div key={item.group} className="inventory-card">
                <div className="inv-group">
                  <span className="blood-type">{item.group}</span>
                  <span className={`status-dot ${item.units < 5 ? 'critical' : item.units < 15 ? 'warning' : 'healthy'}`}></span>
                </div>
                <div className="inv-controls">
                  <button className="ctrl-btn minus" onClick={() => handleUpdate(item.group, -1)}><Minus size={16} /></button>
                  <div className="inv-units">
                     <strong>{item.units}</strong>
                     <span> units</span>
                  </div>
                  <button className="ctrl-btn plus" onClick={() => handleUpdate(item.group, 1)}><Plus size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { createContext, useState, useContext, useEffect } from 'react';

const RecordsContext = createContext();

export const RecordsProvider = ({ children }) => {
  const [records, setRecords] = useState(() => {
    // Load records from localStorage if available
    const savedRecords = localStorage.getItem('records');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });

  // Save to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records));
  }, [records]);

  const addRecord = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };
    setRecords(prevRecords => [...prevRecords, recordWithId]);
    return recordWithId;
  };

  const updateRecord = (id, updatedRecord) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === id ? { ...record, ...updatedRecord, updatedAt: new Date().toISOString() } : record
      )
    );
  };

  const deleteRecord = (id) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
  };

  const generateSampleData = () => {
    const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
    const statuses = ['Active', 'Pending', 'Completed', 'Cancelled', 'On Hold'];
    const sampleRecords = [];

    for (let i = 1; i <= 20; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      sampleRecords.push({
        id: Date.now() + i,
        name: `Sample Record ${i}`,
        category,
        status,
        value: (Math.random() * 1000).toFixed(2),
        description: `This is a sample record #${i} in the ${category} category.`,
        createdAt: createdAt.toISOString(),
      });
    }

    // Add sample records to existing ones
    setRecords(prevRecords => [...sampleRecords, ...prevRecords]);
    return sampleRecords;
  };

  return (
    <RecordsContext.Provider value={{
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      generateSampleData,
    }}>
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
};

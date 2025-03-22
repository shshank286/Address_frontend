import React from "react";

const Table = () => {
  const data = [
    { rank: 1, name: "Alyvia Kelley", email: "a.kelley@gmail.com", phone: "808432123123", points: 79343 },
    { rank: 2, name: "Jaiden Nixon", email: "jaiden.n@gmail.com", phone: "94068432123", points: 49343 },
    { rank: 3, name: "Ace Foley", email: "ace.fo@yahoo.com", phone: "808432123123", points: 19343 },
  ];

  return (
    <table className="w-full border-collapse bg-white">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-4 border">Rank</th>
          <th className="p-4 border">Full Name</th>
          <th className="p-4 border">E-Mail</th>
          <th className="p-4 border">Phone Number</th>
          <th className="p-4 border">Points</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.rank} className="text-center">
            <td className="p-4 border">{item.rank}</td>
            <td className="p-4 border">{item.name}</td>
            <td className="p-4 border">{item.email}</td>
            <td className="p-4 border">{item.phone}</td>
            <td className="p-4 border">{item.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

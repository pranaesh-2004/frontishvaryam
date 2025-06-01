import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tags({ tags }) {
  const navigate = useNavigate();

  return (
    <select
      className="form-select"
      onChange={(e) => navigate(`/tag/${e.target.value}`)}
    >
      {tags.map((tag, index) => (
        <option key={index} value={tag.name}>
          {tag.name} ({tag.count})
        </option>
      ))}
    </select>
  );
}

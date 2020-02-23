import { useState } from 'react';

const useInputChange = fields => {
  const [input, setInput] = useState(fields);

  const handleChange = e => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  return [input, handleChange];
};

export default useInputChange;

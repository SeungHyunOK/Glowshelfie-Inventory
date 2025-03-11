import React, { useState } from "react";

const UploadProducts = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("파일을 선택해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        "https://glowshelfe-inventory.onrender.com/api";
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/products/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("업로드 실패");
      const data = await response.json();
      setMessage("제품 업로드 성공!");
    } catch (error) {
      setMessage("에러 발생: " + error.message);
    }
  };

  return (
    <div>
      <h2>제품 정보 업로드</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">업로드</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadProducts;

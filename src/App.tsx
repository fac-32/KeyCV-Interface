import "./App.css";
import CVUpload from "./components/CV-Upload";
import JobForm from "./components/JobForm";

function App() {
  return (
    <>
      {/* <CVUpload /> */}
      <JobForm />
      {/* <button onClick={handleClick}>Fetch from backend</button> */}
    </>
  );
}

async function handleClick() {
  // const result = await customFetch();
  // console.log(result)
  const message = {message: "Test message from frontend"};

  try {
    const res = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });
    const resStatus = await res.text();
    console.log(resStatus);
  } catch (error) {
    console.error("handleClick error", error);
  }
}

async function customFetch() {
  const data = await fetch("/api");
  const text = data.text();
  return text;
}

export default App;

import { useState } from "react";
import SearchBox from "./components/SearchBox";
import Snackbars from "./components/Snackbars";
import Urls from "./components/Urls";
const App = () => {
  const [responseData, setresponseData] = useState(JSON.parse(localStorage.getItem("URLS")) || []);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false
  })

  return (
    <>
      <SearchBox responseData={responseData} setresponseData={setresponseData} setSnackbarOpen={setSnackbarOpen} />
      {responseData.length > 0 && (
        <>
          <div className="icon-scroll" onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              left: 0,
              behavior: "smooth"
            })
          }} />

          <div className="confirmation">
            {responseData?.map((url, index, array) => (
              <div key={index}>
                <Urls responseData={responseData}
                  setResponseData={setresponseData}
                  setSnackbarOpen={setSnackbarOpen}
                  longUrl={url.longUrl} shortUrl={url.shortUrl} />
                {index !== array.length - 1 && (<hr />)}
              </div>
            ))}
          </div>

        </>
      )}



      <Snackbars setSnackbarOpen={setSnackbarOpen} snackbarOpen={snackbarOpen} />


    </>
  );
}

export default App;

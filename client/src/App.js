import { useState } from "react";
import SearchBox from "./components/SearchBox";
import Snackbars from "./components/Snackbars";
import Urls from "./components/Urls";
import GitHubIcon from '@material-ui/icons/GitHub';
import axios from "axios";
import { useEffect } from "react";
const BACKEND_URL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_URL : ""

const App = () => {
  const [responseData, setresponseData] = useState(JSON.parse(localStorage.getItem("URLS")) || []);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false
  })
  const [viewers, setViewers] = useState({})

  const getViewers = async () => {
    if (responseData.length > 0) {
      const parsedData = responseData.map(data => data.shortUrl.split("/").slice(-1)[0])
      const { data: { viewers } } = await axios.get(BACKEND_URL + "/api/getViewers", {
        params: {
          urlCodes: parsedData.join("&")
        }
      }
      )
      setViewers(viewers)

    }
  }


  useEffect(() => {

    getViewers()

    // eslint-disable-next-line
  }, [responseData])

  return (
    <>
      <div className="githublink">
        <a href="https://github.com/T0jgli/url-shortener" rel="noopener noreferrer" target="_blank">
          GitHub
          <GitHubIcon fontSize="small" />
        </a>
      </div>

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
                <Urls
                  view={viewers}
                  responseData={responseData}
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

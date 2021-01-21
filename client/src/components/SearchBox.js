import { useState } from "react";
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress, Fade } from "@material-ui/core";
import Snackbars from "./Snackbars";

function validURL (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

const SearchBox = () => {
    const [inputUrl, setInputUrl] = useState("");
    const [validUrlError, setValidUrlError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [responseData, setresponseData] = useState(JSON.parse(localStorage.getItem("URLS")) || []);
    const [snackbarOpen, setSnackbarOpen] = useState({
        open: false
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputUrl) return setSnackbarOpen({
            open: true,
            content: "Adj meg egy URL-t!",
            severity: "error",
        });
        if (!validURL(inputUrl)) return setSnackbarOpen({
            open: true,
            content: "Ez nem URL!",
            severity: "error",
        });

        setLoading(true)

        axios.post(process.env.REACT_APP_URL + "/api", {
            urlToShorten: inputUrl
        }).then(res => {
            if (res.status === 200) {
                console.log(res)
                setInputUrl("")
                if (responseData?.includes(res.data.shortUrl)) return setSnackbarOpen({
                    open: true,
                    content: "Az URL már szerepel a listán!",
                    severity: "warning",
                });

                if (responseData.length > 0) {
                    localStorage.setItem("URLS", JSON.stringify([
                        ...responseData, res.data.shortUrl
                    ]))
                }
                else {
                    localStorage.setItem("URLS", JSON.stringify([
                        res.data.shortUrl
                    ]))
                }
                setresponseData(responseData => [...responseData, res.data.shortUrl])
                setSnackbarOpen({
                    open: true,
                    content: "Siker!",
                    severity: "success",
                })
            }
            setLoading(false)


        }).catch(err => {
            setSnackbarOpen({
                open: true,
                content: err.message,
                severity: "error",
            })
            setLoading(false)

        })
    }
    return (
        <>
            <div className="App">
                <h2>
                    URL Shortener by ME
                </h2>
                <div className="searchbox-div">
                    <div className="searchbox">
                        <input placeholder="URL..." value={inputUrl} onChange={e => {
                            setInputUrl(e.target.value);
                            setValidUrlError(false)
                        }} />
                        {inputUrl && (
                            <CloseIcon onClick={() => setInputUrl("")} />
                        )}
                    </div>
                    <div className="button">
                        <button onClick={handleSubmit}>
                            {loading ? (
                                <CircularProgress size={20} style={{ color: "grey" }} />
                            ) : (
                                    "Mehet"
                                )}
                        </button>
                    </div>
                </div>
            </div>

            {validUrlError && (
                <div className="validation-error">
                    <h3>
                        Nem valid
                    </h3>

                </div>
            )}


            <div className="confirmation">
                {responseData?.map(url => (
                    <div className="my-urls">
                        <a target="_blank" rel="noreferrer" href={url}>
                            {url}
                        </a>
                    </div>

                ))}
            </div>

            <Snackbars setSnackbarOpen={setSnackbarOpen} snackbarOpen={snackbarOpen} />

        </>
    )
}

export default SearchBox

import { useState } from "react";
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress } from "@material-ui/core";

/* function validURL (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
 */
const validURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

const SearchBox = ({ responseData, setresponseData, setSnackbarOpen }) => {
    const [inputUrl, setInputUrl] = useState("");
    const [loading, setLoading] = useState(false)

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
                setInputUrl("")
                setLoading(false)

                window.scrollTo({
                    top: window.innerHeight,
                    left: 0,
                    behavior: "smooth"
                })

                if (responseData.find(url => url.longUrl === res.data.longUrl)) return setSnackbarOpen({
                    open: true,
                    content: "Az URL már szerepel a listán!",
                    severity: "warning",
                });

                if (responseData.length > 0) {
                    localStorage.setItem("URLS", JSON.stringify([
                        ...responseData, {
                            shortUrl: res.data.shortUrl,
                            longUrl: res.data.longUrl
                        }
                    ]))
                }
                else {
                    localStorage.setItem("URLS", JSON.stringify([
                        {
                            shortUrl: res.data.shortUrl,
                            longUrl: res.data.longUrl
                        }
                    ]))
                }
                setresponseData(responseData => [...responseData, {
                    shortUrl: res.data.shortUrl,
                    longUrl: res.data.longUrl
                }])
                setSnackbarOpen({
                    open: true,
                    content: "Siker!",
                    severity: "success",
                })
            }
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
        </>
    )
}

export default SearchBox

import { useState } from "react";
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress, Grow } from "@material-ui/core";

const BACKEND_URL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_URL : ""

function validURL (str) {
    if (!str.startsWith("http")) {
        str = "http://" + str;
    }
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

const customUrlRegexp = new RegExp(/[^\w]/)

const SearchBox = ({ responseData, setresponseData, setSnackbarOpen }) => {
    const [inputUrl, setInputUrl] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();

        if (customUrl.includes("api"))
            return setSnackbarOpen({
                open: true,
                content: "Nem megfelelő egyedi azonosító!",
                severity: "error",
            });

        if (!inputUrl)
            return setSnackbarOpen({
                open: true,
                content: "Adj meg egy URL-t!",
                severity: "error",
            });

        if (!validURL(inputUrl))
            return setSnackbarOpen({
                open: true,
                content: "Ez nem URL!",
                severity: "error",
            });

        if (customUrlRegexp.test(customUrl))
            return setSnackbarOpen({
                open: true,
                content: "Az azonosító nem tartalmazhat speciális karaktereket!",
                severity: "error",
            });

        if (responseData.find(url => url.longUrl === inputUrl)) {
            setInputUrl("");
            return setSnackbarOpen({
                open: true,
                content: "Az URL már szerepel a listán!",
                severity: "warning",
            })
        };

        setLoading(true)

        axios.post(BACKEND_URL + "/api", {
            urlToShorten: inputUrl,
            customUrl
        }).then(res => {
            if (res.status === 201) {
                setInputUrl("");
                setCustomUrl("");
                setLoading(false);

                if (res.data.existingError)
                    return setSnackbarOpen({
                        open: true,
                        content: "Ez az azonosító foglalt. Válassz másikat!",
                        severity: "error",
                    })


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
                window.scrollTo({
                    top: window.innerHeight,
                    left: 0,
                    behavior: "smooth"
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
                <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                    <div className="searchbox-div">
                        <div className="searchbox">
                            <input aria-label="Input sáv" placeholder="URL..." value={inputUrl} onChange={e => {
                                setInputUrl(e.target.value);
                            }} />
                            {inputUrl && (
                                <CloseIcon onClick={() => { setInputUrl(""); setCustomUrl("") }} />
                            )}
                        </div>
                        <Grow in={Boolean(inputUrl)}>
                            <div className="custom-url">
                                <input aria-label="Input sáv" placeholder="Egyedi azonosító" value={customUrl} onChange={e => {
                                    setCustomUrl(e.target.value);
                                }} />
                            </div>
                        </Grow>
                        <div className="button">
                            <button type="submit">
                                {loading ? (
                                    <CircularProgress size={20} style={{ color: "grey" }} />
                                ) : (
                                    "Mehet"
                                )}
                            </button>
                        </div>

                    </div>
                </form>

            </div>

        </>
    )
}

export default SearchBox

import { useState } from "react";
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress, Grow } from "@material-ui/core";

function validURL (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

const SearchBox = ({ responseData, setresponseData, setSnackbarOpen }) => {
    const [inputUrl, setInputUrl] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();

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

        if (responseData.find(url => url.longUrl === inputUrl)) {
            setInputUrl("");
            return setSnackbarOpen({
                open: true,
                content: "Az URL már szerepel a listán!",
                severity: "warning",
            })
        };

        setLoading(true)

        axios.post("http://localhost:8080/api", {
            urlToShorten: inputUrl,
            customUrl
        }).then(res => {
            if (res.status === 200) {
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

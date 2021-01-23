import { Button, IconButton } from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";

const Urls = ({ longUrl, shortUrl, setSnackbarOpen, setResponseData, responseData }) => {
    const removeUrl = () => {
        axios.delete("http://localhost:5000" + `/api/${shortUrl.split("/").slice(-1)[0]}`).then(res => {
            const newDataArray = responseData.filter(url => url.shortUrl !== shortUrl)
            setResponseData(newDataArray)
            localStorage.setItem("URLS", JSON.stringify(newDataArray))
            if (res.data.errorMessage) return setSnackbarOpen({
                open: true,
                content: res.data.errorMessage,
                severity: "error",
            })

            if (res.status === 200) {
                return setSnackbarOpen({
                    open: true,
                    content: "Sikeresen eltávolítva",
                    severity: "info",
                })
            }
        })
    }

    return (
        <div className="my-urls">
            <IconButton onClick={removeUrl} size="small" className="delete-icon">
                <CloseIcon />
            </IconButton>
            <ul>
                <li>
                    <span title={longUrl} className="longurl">{longUrl}</span>
                    <span className="shorturl">
                        <a target="_blank" rel="noreferrer" href={shortUrl}>
                            {shortUrl}
                        </a>
                        <Button onClick={() => {
                            navigator.clipboard.writeText(shortUrl)
                            setSnackbarOpen({
                                open: true,
                                content: "URL másolva a vágólapra",
                                severity: "info",
                            })
                        }} style={{ cursor: "pointer" }}>
                            Másolás
                        </Button>

                    </span>
                </li>
            </ul>
        </div>
    )
}

export default Urls

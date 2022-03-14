export function ProfilePic({ url, first, last, showUploader }) {
    url = url || "./defaultPic.jpeg";

    const profilePic = {
        maxWidth: "100%",
    };

    const imgStyle = {
        maxWidth: "10%",
    };

    return (
        <div style={profilePic} id={"profile-pic"} onClick={showUploader}>
            <img style={imgStyle} src={url} alt={`${first} ${last}`} />
        </div>
    );
}

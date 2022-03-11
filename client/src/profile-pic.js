export function ProfilePic({ url, first, last, showUploader }) {
    url = url || "./defaultPic.jpeg";

    return (
        <div id={"profile-pic"} onClick={showUploader}>
            <img alt={`${first} ${last}`} src={url} />
        </div>
    );
}

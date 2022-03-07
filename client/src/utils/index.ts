export function truncate(value: string, length = 20) {
    let name = String(value);
    let ext = "";
    const index = name.lastIndexOf(".");
    if (index !== -1) {
        ext = name.substring(index);
        name = name.substring(0, index);
    }

    if (name.length > length) {
        name = `${name.substr(0, Math.floor((length - 3) / 2))}...${name.substr(
            name.length - Math.floor((length - 3) / 2)
        )}`;
    }
    return `${name}${ext}`;
}

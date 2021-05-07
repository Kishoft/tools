
async function main() {

    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices)
}
main()


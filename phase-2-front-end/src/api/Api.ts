export const getArray = async () => {
    let response = await fetch("https://msa-2020-api.azurewebsites.net/api/Canvas/GetCanvas", {
        headers: {
            Accept: "application/json"
        }
    }).then(res => res.json()).then(res => JSON.parse(res));
    return response;
}

interface ModifyProps {
    position: { i: number, j: number }
    colour: string
}

export const modifyArray = async ({ position, colour }: ModifyProps) => {
    const body = JSON.stringify({"row": position.i, "column": position.j, "hex":colour})
    await fetch("https://msa-2020-api.azurewebsites.net/api/Canvas/UpdateCell", {
        body,
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json"
        },
        method: "PUT"
    })
}
export const userColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
        field: "name",
        headerName: "Email",
        flex: 1,
    },
    {
        field: "associatedTAName",
        hide: true,
        rowGroup: true
    },
    {
        field: "password",
        headerName: "Password",
        flex: .5,
    },
    {
        field: "role",
        headerName: "Role",
        flex: .5,
        rowGroup: true
    },
    {
        field: "department",
        headerName: "Department",
        flex: .5,
    },
    {
        field: "status",
        headerName: "Status",
        flex: .5,
    },
];
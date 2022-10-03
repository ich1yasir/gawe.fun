export const samplerDataGrid = {
    columns: [
        {
            field: "id",
            hide: true
        },
        {
            field: "desk",
            headerName: "Desk",
            width: 110
        },
        {
            field: "commodity",
            headerName: "Commodity",
            width: 180,
            editable: false
        },
        {
            field: "traderName",
            headerName: "Trader Name",
            width: 120,
            editable: false
        },
        {
            field: "traderEmail",
            headerName: "Trader Email",
            width: 150,
            editable: false
        },
        {
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            width: 140,
            editable: false
        },
        {
            field: "filledQuantity",
            headerName: "Filled Quantity",
            availableAggregationFunctions: [
                "min",
                "max",
                "avg",
                "size"
            ],
            type: "number",
            width: 120,
            editable: false
        },
        {
            field: "isFilled",
            headerName: "Is Filled",
            align: "center",
            type: "boolean",
            width: 80,
            editable: false
        },
        {
            field: "status",
            headerName: "Status",
            type: "singleSelect",
            valueOptions: [
                "Open",
                "PartiallyFilled",
                "Filled",
                "Rejected"
            ],
            width: 150,
            editable: false
        },
        {
            field: "unitPrice",
            headerName: "Unit Price",
            type: "number",
            editable: false
        }
    ],
    rows: [
        {
            "id": "3cbc8678-71db-5248-b009-3bdfc607d626",
            "desk": "D-9797",
            "commodity": "Rough Rice",
            "traderName": "Charlie Powell",
            "traderEmail": "wuveh@hofutsu.ht",
            "quantity": 68855,
            "filledQuantity": 0.4732989615859415,
            "isFilled": false,
            "status": "Open",
            "unitPrice": 22.17
        },
        {
            "id": "61eda4e8-980e-5807-879f-63de7dc48acb",
            "desk": "D-9149",
            "commodity": "Corn",
            "traderName": "Addie Kennedy",
            "traderEmail": "udaudabo@fi.hu",
            "quantity": 38907,
            "filledQuantity": 0.44369907728686353,
            "isFilled": false,
            "status": "Rejected",
            "unitPrice": 95.64
        },
        {
            "id": "92fd62a9-7693-53d5-b553-887586944c59",
            "desk": "D-8691",
            "commodity": "Cotton No.2",
            "traderName": "Adeline Hudson",
            "traderEmail": "ivisog@vejpug.af",
            "quantity": 55529,
            "filledQuantity": 0.33369950836499845,
            "isFilled": false,
            "status": "Open",
            "unitPrice": 13.94
        },
        {
            "id": "fa1402b2-7574-57d9-ad51-18282c191671",
            "desk": "D-6470",
            "commodity": "Sugar No.14",
            "traderName": "Ian George",
            "traderEmail": "ovair@pog.bw",
            "quantity": 73854,
            "filledQuantity": 0.9548027188777859,
            "isFilled": false,
            "status": "Rejected",
            "unitPrice": 32.6
        },
        {
            "id": "bddb4a18-ac44-5198-a1bf-dde8d396ed8a",
            "desk": "D-6000",
            "commodity": "Cotton No.2",
            "traderName": "Brett Glover",
            "traderEmail": "bazvuajo@pusdintug.fr",
            "quantity": 86150,
            "filledQuantity": 0.6848984329657574,
            "isFilled": false,
            "status": "Open",
            "unitPrice": 43.27
        },
        {
            "id": "5ef102bb-af97-5f6c-8a1e-1b5b3379624b",
            "desk": "D-8388",
            "commodity": "Milk",
            "traderName": "Louis Barker",
            "traderEmail": "ne@nelbutvo.pm",
            "quantity": 34858,
            "filledQuantity": 0.36909748120947844,
            "isFilled": false,
            "status": "Rejected",
            "unitPrice": 14.5
        },
        {
            "id": "1a19b2a7-9e43-5725-b83d-39ee8211fc08",
            "desk": "D-6761",
            "commodity": "Soybean Oil",
            "traderName": "Mario Copeland",
            "traderEmail": "wedverviv@kifarpe.td",
            "quantity": 90991,
            "filledQuantity": 0.6336011253860272,
            "isFilled": false,
            "status": "Filled",
            "unitPrice": 13.64
        },
        {
            "id": "2315b50b-649e-515a-a330-6c087d0719eb",
            "desk": "D-6691",
            "commodity": "Frozen Concentrated Orange Juice",
            "traderName": "Brent Floyd",
            "traderEmail": "ta@bu.pm",
            "quantity": 97644,
            "filledQuantity": 0.9598029576830117,
            "isFilled": false,
            "status": "Rejected",
            "unitPrice": 23.65
        },
        {
            "id": "8134bd3c-f752-509e-9c2e-70adb5f671cc",
            "desk": "D-4593",
            "commodity": "Milk",
            "traderName": "Ophelia Hale",
            "traderEmail": "bihek@zozakfoj.gb",
            "quantity": 43194,
            "filledQuantity": 0.5510024540445432,
            "isFilled": false,
            "status": "Filled",
            "unitPrice": 59.29
        },
        {
            "id": "446f1062-b264-5348-831c-38583fcf7061",
            "desk": "D-622",
            "commodity": "Corn",
            "traderName": "Etta Morton",
            "traderEmail": "hipunci@zav.py",
            "quantity": 1138,
            "filledQuantity": 0.6300527240773286,
            "isFilled": false,
            "status": "PartiallyFilled",
            "unitPrice": 16.93
        }
    ],
    initialState: {
        "columns": {
            "columnVisibilityModel": {
                "id": false
            }
        }
    }
}
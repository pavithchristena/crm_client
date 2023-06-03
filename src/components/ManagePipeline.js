import React, { useEffect, useState } from 'react';
import styles from "../components/ManagePipeline.module.css";
import { Persona, SearchBox, PersonaSize, PrimaryButton, Shimmer, FontIcon } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { DetailsList, DetailsRow } from '@fluentui/react/lib/DetailsList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Salespipeline from './Salespipeline';

// Initialize Fluent UI icons
initializeIcons();

const addIcon = { iconName: 'Add' };
const searchIcon = { iconName: 'Search' };

const miniPersonaStyles = {
    root: {
        cursor: "pointer",
        // alignItems: "flex-start",
        height: 24,
        color: '#C7CBCE'
    },
    details: {
        display: "none",
    },
};

const iconClass1 = ({
    fontSize: 12,
    height: 12,
    width: 12,
    margin: '0 ',
    color: '#999DA0',
});
let items = Array(4).fill(null);
const ManagePipeline = () => {
    const [showMessageBar, setShowMessageBar] = useState(false);
    const demandCreator = localStorage.getItem("demand_creator")
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fetchOptions, setFetchOptions] = useState({
        skip: 0,
        limit: 15,
        sort_field: 'updatedAt',
        sort_type: -1,
        search_field: ''
    })
    const [clientData, setClientData] = useState()
    const navigate = useNavigate();
    const navigateTo = useNavigate();
    const columns = [
        {
            columnKey: "Opportunity ID",
            label: "Opportunity ID"
        }, {
            columnKey: "Opportunity Type",
            label: "Opportunity Type"
        }, {
            columnKey: "Account/Lead",
            label: "Account/Lead"
        }, {
            columnKey: "Geo/Location",
            label: "Geo/Location"
        }, {
            columnKey: "Entry Date",
            label: "Entry Date"
        }, {
            columnKey: "Closure Date",
            label: "Closure Date"
        }, {
            columnKey: "Funnel Stage",
            label: "Funnel Stage"
        }, {
            columnKey: "POC/Source",
            label: "POC/Source"
        }, {
            columnKey: "BU Head",
            label: "BU Head"
        }, {
            columnKey: "Deal $K ",
            label: "Deal $K"
        }, {
            columnKey: "Conf., Percentage",
            label: "Conf., Percentage"
        }, {
            columnKey: "Conf., Adjust Deal",
            label: "Conf., Adjust Deal"
        },
        {
            columnKey: "Short Status",
            label: "Short Status"
        },


    ]

    const clickSortHandler = (key) => {

        console.log(key)

        if (!isDataLoaded) return;

        if (key === 'createdAt') {
            setFetchOptions(
                {
                    ...fetchOptions,
                    sort_field: key,
                    sort_type: fetchOptions.sort_type === -1 ? 1 : -1,
                }
            )

        }
    }
    useEffect(() => {
        axios
            .get('https://crmback.sightspectrum.co.in/getclientdata')
            .then((getdata) => {
                setClientData(getdata.data)

            });
    }, [])
    console.log(clientData);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleNavigate = () => {
        navigate('/salespipeline');
    }

    return (
        <div>
            {isModalOpen && (
                <Salespipeline
                    showMessageBar={showMessageBar}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={closeModal}
                    setShowMessageBar={setShowMessageBar}
                    focus={false}
                />
            )}
            <div className={styles.main_border}>
                <div className={styles.main_logo}>
                    <div className={styles.style_logo}><span>LOGO</span></div>
                    <div className={styles.route_heading}>
                        <span className={styles.main_title}>Sales Pipeline / Manage Pipeline</span>
                    </div>
                </div>
                <div className={styles.persona_user}>
                    <Persona
                        className={styles.persona_user_logo}
                        size={PersonaSize.size24}
                        styles={miniPersonaStyles}
                    />
                </div>
            </div>

            <div className={styles.main_border1}></div>

            <div className={styles.main_container}></div>

            <div className={styles.manage_sales_Title}>Manage Sales Pipeline</div>
            <div className={styles.search_bar}>
                <SearchBox className={styles.search} placeholder=" " iconProps={searchIcon} />
            </div>
            <div className={styles.add_new_button}>
                <PrimaryButton
                    style={{ display: (demandCreator == "true") ? 'block' : 'none' }}
                    text="Add New"
                    iconProps={addIcon}
                    className={styles['custom-button']}
                    onClick={handleNavigate}
                // onClick={openModal}
                // onClick={(e) => { setTimeout(() => setIsModalOpen(!isModalOpen), 0); }}
                />
            </div>

            <div className={styles.table_container}>
                <table>
                    <thead className={styles.table_header}>
                        <tr className={styles.table_row}>
                            {columns.map((column) =>
                                <th onClick={() => clickSortHandler(column.columnKey)} className={styles.table_headerContents} key={column.columnKey}>
                                    <div className={styles.table_heading}>
                                        <div>{column.label}</div>
                                        {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                                    </div>
                                </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {clientData && clientData.map((data) => (
                            <tr className={styles.table_row} >

                                <td className={styles.table_dataContents}>{data.opportunity_id}</td>
                                <td className={styles.table_dataContents}>{data.opportunity_type}
                                </td>
                                <td className={styles.table_dataContents}>{data.account_lead}</td>

                                <td className={styles.table_dataContents}>{data.geo_location}</td>
                                <td className={styles.table_dataContents}>{(new Date(data.entry_date)).toLocaleDateString('en-GB')}</td>
                                <td className={styles.table_dataContents}>{(new Date(data.closure_date)).toLocaleDateString('en-GB')}</td>
                                <td className={styles.table_dataContents}>{data.funnel_stage}</td>
                                <td className={styles.table_dataContents}
                                >{data.poc_source}


                                </td>
                                <td className={styles.table_dataContents}>{data.bu_lead}</td>
                                <td className={styles.table_dataContents}
                                >{data.deal_$K}

                                </td>
                                <td className={styles.table_dataContents}>{data.conf_percentage}</td>
                                <td className={styles.table_dataContents}
                                >
                                    {data.conf_adjust_deal}

                                </td>
                                <td className={styles.table_dataContents}
                                >
                                    {data.short_status}

                                </td>

                            </tr>
                        ))}
                        {/* {!isDataLoaded && items.map(employee =>
                            <tr className={styles.table_row} >
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /></td>
                                <td className={styles.table_dataContents}><Shimmer /> </td>
                                <td className={styles.table_dataContents}>
                                    <div className={styles.moreOptions} >
                                        <FontIcon iconName='MoreVertical' className={iconClass1} />
                                    </div>
                                </td>
                            </tr>)} */}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default ManagePipeline;

import React, { useEffect, useState } from 'react';
import { Dropdown, PrimaryButton, DatePicker, TextField } from '@fluentui/react'
import { Button, Modal, Box, Typography } from '@mui/material';
import { Icon } from "@fluentui/react/lib/Icon";
import styles from "../components/SalesPipeline.module.css"
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import boldicon from "../assests/boldicon.svg"
import undoicon from "../assests/undoicon.svg";
import redoicon from "../assests/redoicon.svg";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { FaItalic, FaUnderline, FaListUl, FaLink } from 'react-icons/fa';
import axios from 'axios';
import draftToHtml from "draftjs-to-html";
import { useNavigate } from 'react-router-dom';



initializeIcons();
// Define the icon variables
const italicIcon = <FaItalic />;
const underlineIcon = <FaUnderline />;
const bulletsIcon = <FaListUl />;
const linkIcon = <FaLink />;

const vendorRegex = /^[a-zA-Z0-9 @,.()-]*$/;
const calendarClass = (props, currentHover, error, value) => {
    return {
        root: {
            "*": {
                width: "110%",
                fontSize: "12px !important",
                height: "22px !important",
                lineHeight: "20px !important",
                borderColor: error
                    ? "rgb(168,0,0)"
                    : currentHover === value
                        ? "rgb(50, 49, 48) !important "
                        : "transparent !important",
                selectors: {
                    ":hover": {
                        borderColor: "rgb(50, 49, 48) !important",
                    },
                },
            },
        },

        icon: { height: 10, width: 10, left: "85%", padding: "0px 0px" },
    };
};

const dropDownStylesActive = (props, currentHover, error, value) => {
    return {
        dropdown: {
            width: "150px",
            minWidth: "150px",
            minHeight: "20px",

        },
        title: {
            height: "22px",
            lineHeight: "18px",
            fontSize: "12px",
            backgroundColor: "#FFFFFF",
            borderColor: error
                ? "#a80000"
                : currentHover === value
                    ? "rgb(96, 94, 92)"
                    : "transparent",

        },
        errorMessage: {
            display: "none",
        },
        caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
        dropdownItem: { minHeight: "22px", fontSize: 12 },
        dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
    };
};
const textFieldColored = (props, currentHover, error, value) => {
    return {
        fieldGroup: {
            width: "150px",
            height: "22px",
            backgroundColor: "#FFFFFF",
            // left: "5px",
            // position: "absolute",

            selectors: {
                ":focus": {
                    borderColor: "rgb(96, 94, 92)",
                },
            },
        },
        field: {
            fontSize: 12,
        },
    };
};


const closeIconClass = "custom-close-icon";

const editorToolbarOptions = {
    options: ["inline", "list", "link", "history"],
    inline: {
        bold: { icon: boldicon, className: undefined },
        options: ["bold", "italic", "underline"],
    },
    list: {
        options: ["unordered", "ordered"],
    },
    link: {
        options: ["link"],
    },
    history: {
        options: ["undo", "redo"],
        undo: { icon: undoicon },
        redo: { icon: redoicon },
    },

};



const datePickerStyles = {
    root: {
        width: '157px',
        height: '18px',
        borderRadius: '2px',
    },
};

const Salespipeline = (props) => {
    const navigate = useNavigate()
    const [isModalShrunk, setIsModalShrunk] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [currentHover, setCurrentHover] = useState("");
    const [pipelineData, setPipelineData] = useState({
        account_lead: '',
        opportunity_type: '',
        opportunity_description: '',
        geo_location: '',
        deal_$K: '',
        conf_percentage: '',
        conf_adjust_deal: '',
        funnel_stage: '',
        closure_date: '',
        entry_date: '',
        short_status: '',
        poc_source: '',
        ss_sales: '',
        bu_lead: '',
        addtional_remarks: ''

    })
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const [editorState2, setEditorState2] = useState(() =>
        EditorState.createEmpty()
    );
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        setPipelineData((prevData) => {
            return {
                ...prevData,
                opportunity_description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                addtional_remarks: draftToHtml(convertToRaw(editorState2.getCurrentContent())),
            };
        });
    }, [editorState, editorState2]);
    const handleEditorStateChange = (newEditorState) => {
        const content = newEditorState.getCurrentContent().getPlainText().trim();
        if (content.length < 10) {
            setErrorMessage('Minimum 10 characters Required');
        } else {
            setErrorMessage('');
        }
        setEditorState(newEditorState);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };



    const modalSizeHandler = () => {
        setIsModalShrunk(!isModalShrunk);
    };
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const customDropdownSuffix = {
        content: <Icon iconName="ChevronDown" />,
        styles: { root: { marginRight: "8px" } },
    };

    const opportunityTypeOptions = [
        { key: "Consulting", text: "Consulting" },
        { key: "Project FB", text: "Project FB" },
        { key: "Project TM", text: "Project TM" },
        { key: "Managed Staffing", text: "Managed Staffing" },
        { key: "Staffing", text: "Staffing" },
    ];
    const funnelStageOptions = [
        { key: "Prospect", text: "Prospect" },
        { key: "Lead", text: "Lead" },
        { key: "Presales", text: "Presales" },
        { key: "Bid", text: "Bid" },
        { key: "Sales", text: "Sales" },
        { key: "Closure", text: "Closure" },
        { key: "Negotiation", text: "Negotiation" },
        { key: "Won", text: "Won" },
        { key: "Lost", text: "Lost" },
        { key: "On Hold", text: "On Hold" },
        { key: "N/A", text: "N/A" },

    ];
    const shortStatusOptions = [
        { key: "Open", text: "Open" },
        { key: "In-progress", text: "In-progress" },
        { key: "Done", text: "Done" },
    ]


    const close = (() => {


    }, []);
    const modalContentClass = isFullScreen ? `${styles.modalContent} ${styles.fullScreen}` : styles.modalContent;
    const modalContainerClass = isFullScreen ? `${styles.modalContainer} ${styles.fullScreenContainer}` : styles.modalContainer;

    const submitHandler = async () => {
        try {
            const response = await axios.post("https://crmback.sightspectrum.co.in/addnew", pipelineData);
            console.log(response.data);
            setErrorMsg('');
            setPipelineData(response.data)
            navigate('/');
        } catch (error) {
            console.error("Error submitting data:", error);
            setErrorMsg("Error submitting data");
        }
    }
    const hoverHandler = (name) => {
        setCurrentHover(name);
    };
    const dateHandler = (date, name) => {
        setPipelineData((prevData) => {
            return {
                ...prevData,
                [name]: date,
            };
        });


        setCurrentHover("");
    };
    const dropDownHandler = (e, item, name) => {
        setPipelineData((prevData) => {
            return {
                ...prevData,
                [name]: item.text,
            };
        });

    };
    let minDate = new Date();

    const inputChangeHandler = (e, inputName) => {
        // e.preventDefault();
        const { value } = e.target;
        let inputValue = value;

        let isInputValid = true;



        if (inputName === "poc_source") {
            isInputValid = vendorRegex.test(value);
        }

        if (inputName === "ss_sales") {

            isInputValid = vendorRegex.test(value);
        }

        if (inputName === "bu_lead") {

            isInputValid = vendorRegex.test(value);
        }

        if (inputName === "geo_location") {

            isInputValid = vendorRegex.test(value);
        }

        if (inputName === "account_lead") {

            isInputValid = vendorRegex.test(value);
        }

        if (inputName === "deal_$K") {

            isInputValid = vendorRegex.test(value);
        }
        if (inputName === "conf_adjust_deal") {

            isInputValid = vendorRegex.test(value);
        }
        if (inputName === "conf_percentage") {

            isInputValid = vendorRegex.test(value);
        }
        if (inputName === "conf_adjust_deal") {

            isInputValid = vendorRegex.test(value);
        }
        if (inputName === "addtional_remarks") {

            isInputValid = vendorRegex.test(value);
        }


        if (isInputValid) {
            setPipelineData({
                ...pipelineData,
                [inputName]: inputValue,
            });

        }
    };

    return (
        <>
            {/* <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            > */}
            <div className={styles.a}>
                <div className={styles.aa}></div>
                <div className={styles.ab}>
                    <div className={styles.header_Title}>Sales Pipeline Sheet</div>
                    <div className={styles.header_content_title_container}>OPPORTUNITY ID :</div>
                </div>
                <div>
                    <div
                        onClick={modalSizeHandler}
                        className={styles.header_expand_icon_container}
                    >
                        {isModalShrunk ? (
                            <Icon iconName="FullScreen" className={styles.contractIconClass} />
                        ) : (
                            <Icon iconName="BackToWindow" className={styles.contractIconClass} />
                        )}
                    </div>
                    <div
                        onClick={() => close()}
                        className={styles.header_close_icon_container}
                    >
                        <Icon iconName="ChromeClose" className={styles.closeIconClass} />
                    </div>
                </div>
                <div className={styles.ac}>
                    <div className={styles.header_save_close_btns_container}>
                        <PrimaryButton
                            text={`Save & Close`}
                            onClick={submitHandler}
                            iconProps={{ iconName: "Save" }} />
                    </div>
                </div>
            </div>
            <div className={styles.border}></div>

            <div className={styles.b}>
                <div className={styles.Each}>
                    <label className={styles.label_style}>Opportunity Type</label>
                    <div onClick={() => setCurrentHover("opportunity_type")}>
                        <Dropdown
                            onChange={(e, item) => {
                                dropDownHandler(e, item, "opportunity_type");
                                setCurrentHover("");
                                setPipelineData({ ...pipelineData, opportunity_type: item.key });

                            }}

                            placeholder="Select"
                            options={opportunityTypeOptions}
                            selectedKey={pipelineData.opportunity_type}
                            notifyOnReselect
                            styles={dropDownStylesActive} />
                    </div>
                </div>
                <div className={styles.Each}>
                    <label className={styles.label_style}>Entry Date</label>
                    <DatePicker
                        minDate={minDate}
                        className={styles.myDatePicker}
                        styles={calendarClass}
                        placeholder="DD/MM/YYYY"
                        onSelectDate={(date) => dateHandler(date, 'entry_date')}
                        value={pipelineData.entry_date}
                    />
                </div>
                <div className={styles.Each}>
                    <label className={styles.label_style}>Closure Date</label>
                    <DatePicker
                        minDate={minDate}
                        className={styles.myDatePicker}
                        styles={calendarClass}
                        placeholder="DD/MM/YYYY"
                        onSelectDate={(date) => dateHandler(date, 'closure_date')}
                        value={pipelineData.closure_date} />
                </div>
                <div className={styles.Each}>
                    <label className={styles.label_style}>Short Status</label>
                    <Dropdown
                        onChange={(e, item) => {
                            dropDownHandler(e, item, "short_status");
                            setCurrentHover("");
                            setPipelineData({ ...pipelineData, short_status: item.key });

                        }}
                        placeholder="Select"
                        options={shortStatusOptions}
                        selectedKey={pipelineData.short_status}
                        notifyOnReselect
                        styles={dropDownStylesActive}
                    />
                </div>
            </div>
            <div className={styles.border}></div>
            <div className={styles.main_container}>
                <div className={styles.additional_information_container}>
                    <div className={styles.addtional_information_title}>Additional Information</div>
                    <div className={styles.grid_container}>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>POC/Source</label>
                            <TextField
                                value={pipelineData.poc_source}
                                onChange={(e) => {
                                    inputChangeHandler(e, "poc_source");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored} />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>SS Sales</label>
                            <TextField
                                value={pipelineData.ss_sales}
                                onChange={(e) => {
                                    inputChangeHandler(e, "ss_sales");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored} />

                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>BU Head</label>
                            <TextField
                                value={pipelineData.bu_lead}
                                onChange={(e) => {
                                    inputChangeHandler(e, "bu_lead");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored} />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Geo Location</label>
                            <TextField
                                value={pipelineData.geo_location}
                                onChange={(e) => {
                                    inputChangeHandler(e, "geo_location");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored}
                            />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Account/Lead</label>
                            <TextField
                                value={pipelineData.account_lead}
                                onChange={(e) => {
                                    inputChangeHandler(e, "account_lead");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored}
                            />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Funnel Stage</label>
                            <Dropdown
                                onChange={(e, item) => {
                                    dropDownHandler(e, item, "funnel_stage");
                                    setCurrentHover("");
                                    setPipelineData({ ...pipelineData, funnel_stage: item.key });

                                }}
                                placeholder="Select"
                                options={funnelStageOptions}
                                selectedKey={pipelineData.funnel_stage}
                                notifyOnReselect
                                styles={dropDownStylesActive}
                            />
                        </div>

                    </div>

                </div>
                <div className={styles.pricing_details_container}>
                    <div className={styles.pricing_details_title}>Pricing Details</div>
                    <div className={styles.grid_container}>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Deal $ K</label>
                            <TextField
                                value={pipelineData.deal_$K}
                                onChange={(e) => {
                                    inputChangeHandler(e, "deal_$K");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored}
                            />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Conf., Adjust Deal</label>
                            <TextField
                                value={pipelineData.conf_adjust_deal}
                                onChange={(e) => {
                                    inputChangeHandler(e, "conf_adjust_deal");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored} />
                        </div>
                        <div className={styles.add_info}>
                            <label className={styles.label_style}>Conf., Percentage</label>
                            <TextField
                                value={pipelineData.conf_percentage}
                                onChange={(e) => {
                                    inputChangeHandler(e, "conf_percentage");
                                    setCurrentHover("");
                                }}
                                styles={textFieldColored} />
                        </div>

                    </div>

                </div>


            </div>
            <div className={styles.main_container}>
                <div className={styles.additional_information_container}>
                    <div className={styles.opportunity_description_title}>Opportunity Description</div>
                    <div className={styles.oppurtunity_description}>


                        <Editor
                            wrapperClassName={
                                styles.editor_wrapper}
                            toolbar={editorToolbarOptions}
                            toolbarOnFocus

                            editorClassName={
                                styles.editor_editor}
                            placeholder="Click to opportunity description"
                            editorState={editorState}
                            onEditorStateChange={handleEditorStateChange}

                        />
                    </div>
                </div>
                <div className={styles.additional_remarks_container}>
                    <div className={styles.additional_remarks_title}>Additional Remarks</div>
                    <div className={styles.additional_remarks}>

                        <Editor
                            wrapperClassName={styles.editor_wrapper}
                            toolbar={editorToolbarOptions}
                            toolbarOnFocus
                            editorClassName={styles.editor_editor}
                            placeholder="Click to add Remarks"
                            editorState={editorState2}
                            onEditorStateChange={(editorState2) =>
                                setEditorState2(editorState2)
                            }

                        />
                    </div>
                </div>
            </div>
            {/* </Modal> */}
        </>
    )
}

export default Salespipeline

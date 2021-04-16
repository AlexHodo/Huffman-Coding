import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import "./App.css";
import "./ResizerStyle.css";
import PrimaryMenu from "./components/PrimaryMenu";
import useWindowDimensions from "./hooks/useWindowDimensions";
import SplitPane, { Pane } from "react-split-pane";
import ContentEditable from "react-contenteditable";
import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import EditIcon from "@material-ui/icons/Edit";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import axios from "axios";

const appBarHeight = 64;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0F7CFB',
      contrastText: '#fff',
    },
    secondary: {
      main: '#263238',
      contrastText: '#fff'
    }
  },
});

const useStyles = makeStyles((theme) => ({
  primaryMenu: {},
  secondaryMenu: {
    background: "rgba(237,239,241,0.8)",
    backdropFilter: "blur(5px)",
    position: "absolute",
    width: "100%",
    height: "40px",
    left: 0,
    top: 0,
    borderBottom: "1px solid #E1DBDC",
    padding: "0 0.5rem",
    overflow: "hidden !important"
  },
  secondaryMenuItemLeft: {
    textAlign: "left",
  },
  secondaryMenuItemRight: {
    textAlign: "right",
  },
  secondaryMenuItemCenter: {
    textAlign: "center",
  },
  secondaryMenuInputWrapper: {
    top: appBarHeight,
  },
  content: {
    height: "calc(100vh - 64px)",
    background: "#FFFFFF",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    paddingTop: "40px",
  },
  input: {
    padding: "0.5rem",
    paddingTop: "calc(64px + 0.5rem)",
    width: "calc(100% - 1rem) !important",
    maxWidth: "calc(100% - 1rem) !important",
    height: "calc(100% - 64px - 1.5rem) !important",
    maxHeight: "calc(100% - 64px - 1.5rem) !important",
    textAlign: "left",
    overflow: "scroll",
    outline: "none",
    fontSize: "1.25rem",
    fontFamily: "monospace",
    fontWeight: 600,
    letterSpacing: "1px",
    lineHeight: "1rem",
    border: "none"
  },
  outputWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  output: {
    padding: "0.5rem",
    width: "calc(100% - 1rem)",
    height: "calc(100% - 1rem - 40px) !important",
    textAlign: "left",
    overflow: "scroll",
    outline: "none",
    fontSize: "1.25rem",
    lineHeight: "1rem",
    fontFamily: "monospace",
    fontWeight: 600,
    letterSpacing: "1px",
    paddingTop: "calc(40px + 0.5rem)",
  },
  sidebarWrapper: {
    paddingTop: "64px",
  },
  panes: {
    [theme.breakpoints.down("xs")]: {
      '& > .Pane:first-child': {
        display: "none !important"
      }
    }
  },
  characterWrapper: {
    cursor: "pointer",
    display: "inline-block",
    whiteSpace: "pre",
    overflow: "hidden !important",
    "&.highlightedIndex": {
      color: "white !important",
      background: "black !important",
      textDecoration: "none !important",
    },
    "&.highlightedKey": {
      background: "rgba(0,0,0,.1)",
    },
    "&:hover": {
      textDecoration: "underline",
    },
  },
  monospace: {
    fontFamily: "monospace",
    fontSize: "1.25rem",
    color: "white",
    background: "black",
    padding: "1px 2px",
    fontWeight: 600,
  },
  contentPanels: {
    "& *": {
      overflow: "scroll",
    },
  },
  table: {},
  tableRow: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  tableCell: {
    padding: "3px 6px 3px 4px",
  },
  tableCellSecondary: {
    padding: "0 6px 0 4px",
  },
  tableHead: {
    height: "40px",
    background: "transparent",
    boxShadow: "none",

    borderBottom: "1px solid #E1DBDC",
  },
  tableHeadCell: {
    background: "rgba(237,239,241,0.8)",
    backdropFilter: "blur(10px)",
    padding: "3px 6px 3px 4px",
  },
  tab: {
    height: "40px",
    minHeight: "40px",
    minWidth: "75px",
    fontSize: "0.8rem",
    fontWeight: 500,
    '&.active': {
      background: "#CFE3FB",
      color: "#0F7CFB"
    }
  },
  secondaryMenuInfo: {
    fontSize: "0.75rem",
    margin: "0.5rem"
  }
}));

function DataTableRow(props) {
  const { charData } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.tableRow} style={{ paddingBottom: "0px" }}>
        <TableCell className={classes.tableCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell} align="left">
          <b>
            {charData.isSpecial ? <i>{charData.specialName}</i> : charData.char}
          </b>
        </TableCell>
        <TableCell className={classes.tableCell} align="center">
          {charData.frequency}
        </TableCell>
        <TableCell className={classes.tableCell} align="left">
          <b>{charData.encoding}</b>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className={classes.tableCellSecondary}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <i>c<sub>{charData.isSpecial? charData.specialName : charData.char}</sub></i> = <b><tt>{charData.encoding}</tt></b>
              <br />
              <i>l<sub>{charData.isSpecial? charData.specialName : charData.char}</sub></i> = {charData.encodingLength}
              <br />
              <i>w<sub>{charData.isSpecial? charData.specialName : charData.char}</sub></i> = {charData.weight}
              <br />
              <i>l<sub>{charData.isSpecial? charData.specialName : charData.char}</sub>w<sub>{charData.isSpecial? charData.specialName : charData.char}</sub></i> = {charData.contribution}
              <br />
              Frequency: {charData.frequencyExtended} ({charData.frequencyPercent}%)
              <br />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

export default function App() {
  const initialState = {
    output: "",
    input: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis erat urna, malesuada et neque sed, efficitur vehicula justo. Curabitur quis faucibus odio.\nSed facilisis lacus nec tempor condimentum. Aenean eget odio turpis. Morbi consectetur ante arcu, non tempor arcu volutpat id.",
    inputLength: 0,
    dataLoaded: false,
    data: {},
    highlightedKey: null,
    highlightedIndex: null,
    encodings: {},
    frequencies: {},
    outputTab: "binary",
    isComputing: false,
    hexadecimal: null,
    LC: null
  };

  const [state, setState] = useState(initialState);

  const Axios = axios.create({
    baseURL: "https://hodo.codes/project/huffman-coding/api/",
    // baseURL: "http://localhost/huffman/api/",
  });

  const classes = useStyles();
  const { height, width } = useWindowDimensions();

  const inputArr = state.input.split("");

  const handleInputChange = (evt) => {
    setState({
      ...state,
      input: evt.target.value,
    });
  };

  const compute = async (evt) => {
    setState({
      ...state,
      isComputing: true
    })
    const request = await Axios.post("encode", {
      input: state.input,
    }).then((response) => {
      if (response.data.success) {
        setState({
          ...state,
          data: response.data.data,
          input: response.data.input,
          inputLength: response.data.length,
          dataLoaded: true,
          encodings: response.data.encodings,
          frequencies: response.data.frequencies,
          highlightedKey: null,
          highlightedIndex: null,
          isComputing: false,
          hexadecimal: response.data.hex,
          LC: response.data.LC
        });
      } else {
        alert(response.data.errorMsg);
        setState({
          ...state,
          dataLoaded: false,
          isComputing: false
        });
      }
    });
  };

  const requestNewComputation = (evt) => {
    setState({
      ...state,
      dataLoaded: false,
    });
  };

  const dataTable = (
    <TableContainer style={{ height: `${height - appBarHeight}` + "px" }}>
      <Table
        stickyHeader
        className={classes.table}
        size="small"
        aria-label="a dense table"
      >
        {state.dataLoaded && <TableHead>
          <TableRow className={classes.tableHead}>
            <TableCell className={classes.tableHeadCell} />
            <TableCell className={classes.tableHeadCell} align="left">
              Symbol
            </TableCell>
            <TableCell className={classes.tableHeadCell} align="center">
              Freq.
            </TableCell>
            <TableCell className={classes.tableHeadCell} align="left">
              Encoding
            </TableCell>
          </TableRow>
        </TableHead>}
        <TableBody>
          {state.dataLoaded &&
            Object.keys(state.frequencies).map((char, index) => (
              <DataTableRow key={index} charData={state.data[`${char}`]} />
            ))}
          {state.dataLoaded && 
            <TableRow
              className={classes.tableRow}
              style={{ paddingBottom: "0px" }}
            >
              <TableCell
                className={classes.tableCell}
                align="left"
                colSpan={4}
                style={{ padding: "1rem" }}
              >
                <b>Terms</b>
                <br/>
                <i>c<sub>i</sub></i> — codewords of symbol <i>i</i> (binary encoding)
                <br/>
                <i>l<sub>i</sub></i> — codeword length (in bits)
                <br/>
                <i>w<sub>i</sub></i> — weight of symbol <i>i</i>
                <br/>
                <i>l<sub>i</sub>w<sub>i</sub></i> — contribution to weighted path length
                <br/>
                <br/>
                More info about the Huffman coding algorithm can be found <a href="https://en.wikipedia.org/wiki/Huffman_coding" target="_blank">here</a>.
              </TableCell>
            </TableRow>
          }
          {!state.dataLoaded && (
            <TableRow
              className={classes.tableRow}
              style={{ paddingBottom: "0px" }}
            >
              <TableCell
                className={classes.tableCell}
                align="left"
                colSpan={4}
                style={{ padding: "1rem" }}
              >
                More info will appear here after computing the encoding.
                <br />
                <br />
                <b>Tip!</b> Hover over any character to see more details about
                it.
                <br />
                <b>Tip!</b> Click on any character to highlight all its
                occurences.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const inputHtml = state.dataLoaded ? (
    <div>
      {inputArr.map((char, index) => (
        <>
          {(state.data[`${char}`]["isSpecial"] && state.data[`${char}`]["specialName"] == "newline")?
            <>
              <HtmlTooltip
                key={index + "_input"}
                arrow
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      symbol{" "}
                      <span className={classes.monospace}>
                        {state.data[`${char}`]["isSpecial"] ? (
                          <i>{state.data[`${char}`]["specialName"]}</i>
                        ) : (
                          char
                        )}
                      </span>
                    </Typography>
                    Encoding: <i>c<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = <tt><b>{state.data[`${char}`]["encoding"]}</b></tt>
                    <br />
                    Length: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["encodingLength"]}
                    <br />
                    Weight: <i>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["weight"]}
                    <br />
                    Contribution: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["contribution"]}
                    <br />
                    Frequency: {state.data[`${char}`]["frequency"]}/{state.inputLength} ({state.data[`${char}`]["frequencyPercent"]}%)
                    <br />
                  </React.Fragment>
                }
              >
                <span
                  style={{ color: state.data[`${char}`]["color"] }}
                  onClick={() => {
                    setState({
                      ...state,
                      highlightedIndex: index,
                      highlightedKey: state.data[`${char}`]["key"],
                    });
                  }}
                  className={`${classes.characterWrapper}${
                    state.highlightedIndex == index ? " highlightedIndex" : ""
                  }${
                    state.highlightedKey == state.data[`${char}`]["key"]
                      ? " highlightedKey"
                      : ""
                  } "newlineChar"`}
                >&#8629;</span> 
              </HtmlTooltip>
              <br/>
            </>:
            <HtmlTooltip
                key={index + "_input"}
                arrow
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      symbol{" "}
                      <span className={classes.monospace}>
                        {state.data[`${char}`]["isSpecial"] ? (
                          <i>{state.data[`${char}`]["specialName"]}</i>
                        ) : (
                          char
                        )}
                      </span>
                    </Typography>
                    Encoding: <i>c<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = <tt><b>{state.data[`${char}`]["encoding"]}</b></tt>
                    <br />
                    Length: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["encodingLength"]}
                    <br />
                    Weight: <i>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["weight"]}
                    <br />
                    Contribution: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["contribution"]}
                    <br />
                    Frequency: {state.data[`${char}`]["frequency"]}/{state.inputLength} ({state.data[`${char}`]["frequencyPercent"]}%)
                    <br />
                  </React.Fragment>
                }
              >
              <span
                style={{ color: state.data[`${char}`]["color"] }}
                onClick={() => {
                  setState({
                    ...state,
                    highlightedIndex: index,
                    highlightedKey: state.data[`${char}`]["key"],
                  });
                }}
                className={`${classes.characterWrapper}${
                  state.highlightedIndex == index ? " highlightedIndex" : ""
                }${
                  state.highlightedKey == state.data[`${char}`]["key"]
                    ? " highlightedKey"
                    : ""
                }`}
              >
                {char}
              </span>
            </HtmlTooltip>
          }
          </>
      ))}
    </div>
  ) : (
    <div />
  );

  const outputHtml = state.dataLoaded ? [
  (state.outputTab == "binary" ?
      <div>
        {inputArr.map((char, index) => (
          <HtmlTooltip
                key={index + "_output"}
                arrow
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      symbol{" "}
                      <span className={classes.monospace}>
                        {state.data[`${char}`]["isSpecial"] ? (
                          <i>{state.data[`${char}`]["specialName"]}</i>
                        ) : (
                          char
                        )}
                      </span>
                    </Typography>
                    Encoding: <i>c<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = <tt><b>{state.data[`${char}`]["encoding"]}</b></tt>
                    <br />
                    Length: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["encodingLength"]}
                    <br />
                    Weight: <i>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["weight"]}
                    <br />
                    Contribution: <i>l<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub>w<sub>{state.data[`${char}`]["isSpecial"]? state.data[`${char}`]["specialName"] : char}</sub></i> = {state.data[`${char}`]["contribution"]}
                    <br />
                    Frequency: {state.data[`${char}`]["frequency"]}/{state.inputLength} ({state.data[`${char}`]["frequencyPercent"]}%)
                    <br />
                  </React.Fragment>
                }
              >
            <span
              style={{ color: state.data[`${char}`]["color"] }}
              onClick={() => {
                setState({
                  ...state,
                  highlightedIndex: index,
                  highlightedKey: state.data[`${char}`]["key"],
                });
              }}
              className={`${classes.characterWrapper} ${
                state.highlightedIndex == index ? "highlightedIndex" : ""
              } ${
                state.highlightedKey == state.data[`${char}`]["key"]
                  ? "highlightedKey"
                  : ""
              }`}
            >
              {state.data[`${char}`]["encoding"]}
            </span>
          </HtmlTooltip>
        ))}
      </div> : <div style={{wordWrap: "break-word"}}>{state.hexadecimal}</div>
    )
  ] : (
    <div>
    { !state.isComputing? 
      <>Click on <i>Compute</i> to see the result...</> :
      <>Please wait...</>
    }
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <PrimaryMenu className={classes.primaryMenu} />
        <div className={classes.content}>
          <SplitPane
            split="vertical"
            minSize={(15 / 100) * width}
            maxSize={(85 / 100) * width}
            defaultSize={(20 / 100) * width}
            className={classes.panes}
          >
            <div className={classes.sidebarWrapper}>{dataTable}</div>
            <SplitPane
              split="horizontal"
              minSize={(25 / 100) * (height - appBarHeight)}
              maxSize={(75 / 100) * (height - appBarHeight)}
              defaultSize={(50 / 100) * (height - appBarHeight)}
              className={classes.contentPanels}
            >
              <div className={classes.inputWrapper}>
                <Grid
                  container
                  alignItems="center"
                  className={`${classes.secondaryMenu} ${classes.secondaryMenuInputWrapper}`}
                >
                  <Grid item xs={6} md={3} className={classes.secondaryMenuItemLeft}>
                    {state.dataLoaded ? (
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        size="small"
                        onClick={requestNewComputation}
                        endIcon={<EditIcon />}
                        fullWidth
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        size="small"
                        onClick={compute}
                        endIcon={<PlayArrowIcon />}
                        disabled={state.isComputing}
                        style={{"color": "white"}}
                        fullWidth
                      >
                        {state.isComputing? "Loading..." : "Compute"}
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={6} md={9} align="right">
                    <Typography variant="span" className={classes.secondaryMenuInfo}>{state.input.length}/2048</Typography>
                    <Typography variant="overline">Input</Typography>
                  </Grid>
                </Grid>
                {state.dataLoaded ? (
                  <div className={classes.input} tagName="article">
                    {inputHtml}
                  </div>
                ) : (
                  <textarea
                    className={classes.input}
                    value={state.input}
                    onChange={handleInputChange}
                    style={{resize: "none"}}
                  />
                )}
              </div>
              <div className={classes.outputWrapper}>
                <Grid
                  container
                  alignItems="center"
                  className={`${classes.secondaryMenu}`}
                  style={{paddingLeft: "0px"}}
                >
                  <Grid item xs={6} className={classes.secondaryMenuItemLeft}>
                    <Tabs
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="disabled tabs example"
                      style={{minHeight: "40px"}}
                    >
                      <Tab 
                        onClick={
                          () => setState({
                            ...state,
                            outputTab: "binary"
                                                  
                          })
                        } 
                        label="Bin" 
                        style={{"height": "40px"}} 
                        className={`${classes.tab} ${state.outputTab == "binary" && "active"}`} 
                      />
                      <Tab 
                        onClick={
                          () => setState({
                            ...state,
                            outputTab: "hexadecimal"
                                                  
                          })
                        } 
                        label="B64" 
                        style={{"height": "40px"}} 
                        className={`${classes.tab} ${state.outputTab == "hexadecimal" && "active"}`} 
                      />
                    </Tabs>
                  </Grid>
                  <Grid item xs={6} align="right">
                    {state.dataLoaded && <Typography variant="span" className={classes.secondaryMenuInfo}><i>L(C)</i>={state.LC}</Typography>}
                    <Typography variant="overline">Output</Typography>
                  </Grid>
                </Grid>
                <div className={classes.output}>{outputHtml}</div>
              </div>
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    </ThemeProvider>
  );
}

import React from "react";
import {
    Button, Badge, Table,
    ModalBody, ModalFooter, ModalHeader, Input, Label,
    Form, FormGroup, Modal
} from 'reactstrap';
import {
    MdAutorenew, MdEdit, MdHighlightOff, MdCheckCircle
} from 'react-icons/md';
import * as myUrl from '../urlLink'

import * as firebase from 'firebase/app';

const perf = firebase.performance();

const initialCurrentPoint = {
    dprodchar_charid: "",
    dprodchar_id: "",
    dprodchar_name: "",
    dprodchar_point: 0,
    dprodchar_userid: 7,
    id: "",
    dprodchar_activeyn: "Y",
}


export default class NestedCharacteristic extends React.Component {

    constructor(props) {
        super(props);
        this.TIPE = (this.props.judul === "TAMBAH") ? true : false
        this.LOADULANG = this.props.loadUlang
        const charID = this.props.currentChar !== undefined ? true : false
        if (charID) {
            this.state =
                {
                    loading: false,
                    result: [{ ...initialCurrentPoint }],
                    inputtedName: '',
                    inputtedNumber: '',
                    inputtedPoint: '',
                    buttonName: "",
                    buttonEditClicked: false,
                    currentPoint: { ...initialCurrentPoint, dprodchar_charid: props.currentChar.hprodchar_id },
                };

        } else {
            this.state =
                {
                    loading: false,
                    result: [],
                    inputtedName: '',
                    inputtedNumber: '',
                    inputtedPoint: '',
                    buttonName: "",
                    buttonEditClicked: false,
                    currentPoint: { ...initialCurrentPoint, dprodchar_charid: "" },
                };
        }

    }

    getKarakterDtlList = (param_charid) => {
        const trace = perf.trace('getKarakterDtlList');
        trace.start();
        const urlA = myUrl.url_getKarakterDtlList;

        var payload = {
            charid: param_charid,
            token : window.localStorage.getItem('token'),
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }
        this.fetchData();
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.showNotification("Tidak ada point untuk karakteristik tersebut !", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {

                    this.props.showNotification(data.responseDescription, 'error');
                } else {
                    this.setState({ result: data.result });
                    const newResult = this.state.result.map((file) => {

                        return { ...file, id: "" };
                    });
                    this.setState({ result: newResult, loading: false });
                }
            }).catch((err) => {
                this.props.showNotification("Koneksi ke server gagal!", 'error');
            });
    }

    //modal updateYN
    state = {
        modal_statusData: false,
        modal_statusDataBody: "",
        modal_statusDataTitle: "",
        karakterstatus: {},
    };

    //modal edit
    state = {
        modal_edit: false,
        modal_backdrop: false,
        modal_nested_parent_edit: false,
        modal_nested_edit: false,
        editPoint: { ...initialCurrentPoint },
    }

    //modal tambah
    state = {
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    toggle = modalType => () => {

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggleEditData = (modalType, todo) => () => {
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
            editPoint: todo,
        });
    }

    toggleStatusData = (todo) => () => {
        var modalTitle = "";
        var modalBody = "";
        if (todo.dprodchar_activeyn === "Y") {
            modalTitle = "Konfirmasi Penonaktifan";
            modalBody =
                "Apakah Anda yakin ingin menonaktifkan data ini?"
        } else {
            modalTitle = "Konfirmasi Pengaktifan";
            modalBody = "Apakah Anda yakin ingin mengaktifkan data ini?";
        }
        this.setState({
            modal_statusData: true,
            modal_statusDataTitle: modalTitle,
            modal_statusDataBody: modalBody,
            karakterstatus: todo,
        });
    }

    componentDidMount() {
        !(this.props.judul === "TAMBAH") && this.getKarakterDtlList(this.props.currentChar.hprodchar_id);
    }

    fetchData = () => {
        this.setState({ loading: true });
    };

    validatePoint(todo, currButton = null) {
        var currentPointName = (this.state.result.map(point => {
            return point.dprodchar_name;
        }));

        if ((currButton.name).includes('Tambah') && !(currentPointName).includes(todo.dprodchar_name)) {
            return true;
        }
        else if ((currButton.name).includes('Edit') && !(currentPointName).includes(todo.dprodchar_name)) {
            let found = this.state.result.find(element => element.dprodchar_id === todo.dprodchar_id && element.dprodchar_name === todo.dprodchar_name);
            if (found)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    updatePointTabel = (todo, activeyn = null) => (event) => {
        var target = event.target;
        if (!this.validatePoint(todo, target)) {

            this.setState({
                modal_nested: false,
                modal_nested_parent: false,
                modal_nested_edit: false,
                modal_nested_parent_edit: false,
            }, () => {
                this.props.showNotification("Point sudah ada !", 'error');
                return;
            });

        } else {
            if ((target.name).includes('Tambah')) {
                if (this.TIPE) {
                    todo["id"] = this.state.result.length + 1;
                }
                this.setState(prevState => ({
                    result: [...prevState.result, todo],
                    modal_nested: false,
                    modal_nested_parent: false,
                }));
            } else if ((target.name).includes('Edit')) {
                if (this.TIPE) {
                    this.setState(prevState => ({
                        result: prevState.result.map(
                            el => el.id === todo.id ? { ...todo } : el
                        ), modal_nested_edit: false,
                        modal_nested_parent_edit: false,
                    }));
                } else {
                    this.setState(prevState => ({
                        result: prevState.result.map(
                            el => el.dprodchar_id === todo.dprodchar_id ? { ...todo } : el
                        ), modal_nested_edit: false,
                        modal_nested_parent_edit: false,
                    }));
                }

            } else {
                this.setState(prevState => ({
                    result: prevState.result.map(
                        el => el.dprodchar_id === todo.dprodchar_id ? { ...todo, dprodchar_activeyn: activeyn } : el
                    ),
                    modal_statusData: false,
                }));
            }
        }
    }

    updateInputValue(value, field, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        } else {
            Point = { ...this.state.editPoint };
        }

        Point[field] = value;
        this.setState({
            [`${name}Point`]: Point,
            inputtedPoint: value
        });
    }

    updateNumberValue(value, field, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        } else {
            Point = { ...this.state.editPoint };
        }

        Point[field] = value;
        this.setState({
            [`${name}Point`]: Point,
            inputtedNumber: value,
        });
    }

    setKarakterActiveYN = (param1) => (event) => {
        if (param1.dprodchar_activeyn === "Y") {
            this.updatePointTabel(param1, "N")(event)
        } else {
            this.updatePointTabel(param1, "Y")(event)
        }
    }


    setName = (event) => {
        this.setState({
            inputtedName: event.target.value
        });

    }


    clearForm = (param) => () => {
        if (param === true) {
            this.setState({
                inputtedPoint: "",
                inputtedNumber: "",
                currentPoint:
                {
                    ...initialCurrentPoint,
                },
            });
        } else {
            this.setState({
                inputtedPoint: "",
                inputtedNumber: "",
                currentPoint:
                {
                    ...initialCurrentPoint, dprodchar_charid: this.props.currentChar.hprodchar_id
                },
            });
        }

    }

    clearPointTable = () => {
        this.setState({
            inputtedName: '',
            result: [],
        });
    }


    canBeSubmitted() {
        const { inputtedPoint, inputtedNumber } = this.state;
        return true
            && (inputtedPoint.length > 0 && inputtedPoint.trim() !== "" && inputtedPoint.trim().length <= 30)
            && (inputtedNumber.length > 0 && inputtedNumber.trim() !== "" && inputtedNumber.trim().length <= 15);
    }

    canBeSubmittedEdit() {
        const { inputtedPoint, inputtedNumber } = this.state;
        return true
            && ((inputtedPoint.length > 0 && inputtedPoint.trim() !== "" && inputtedPoint.trim().length <= 15)
                || (inputtedNumber.length > 0 && inputtedNumber.trim() !== "" && inputtedNumber.trim().length <= 15));
    }

    canBeSubmittedAdd(param) {
        const { inputtedName, result } = this.state;
        return true
            && (!param ||
                (inputtedName.length > 0 && inputtedName.trim() !== "" && inputtedName.trim().length <= 30 && result.length > 0));
    }

    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }

    render() {
        const currentChar = this.state.result;
        const loading = this.state.loading;
        const isEnabled = this.canBeSubmitted();
        const isEnabledAdd = this.canBeSubmittedAdd(this.TIPE);
        const isEnabledEdit = this.canBeSubmittedEdit();
        const adaData = currentChar && currentChar.length > 0 ? true : false
        const isiTabel = adaData && currentChar.map((todo, i) => {
            return <tr key={i}>
                <th scope="row">{todo.dprodchar_id ? todo.dprodchar_id : "NEW"}</th>
                <td style={{ width: 1 }}>{todo.dprodchar_name}</td>
                <td>{todo.dprodchar_point}</td>
                {todo.dprodchar_activeyn === "Y" &&
                    <td>
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>
                }
                {todo.dprodchar_activeyn !== "Y" &&
                    <td>
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>
                }
                {

                    <td className="text-center">
                        {<Button name={todo.dprodchar_id} style={{ marginRight: "5px" }} color="secondary" size="sm" onClick={this.toggleEditData("nested_parent_edit", { ...todo })}>
                            <MdEdit /></Button>}
                        {!this.TIPE && todo.dprodchar_activeyn === "Y" && <Button name="buttonStatus" color="danger" size="sm" onClick={this.toggleStatusData({ ...todo })}><MdHighlightOff /></Button>}
                        {!this.TIPE && todo.dprodchar_activeyn !== "Y" && <Button name="buttonStatus" color="success" size="sm" onClick={this.toggleStatusData({ ...todo })}><MdCheckCircle /></Button>}
                    </td>
                }
            </tr>
        });

        const tabelPoint = <Table responsive
            striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {!adaData && <tr>
                    <td style={{ backgroundColor: 'white' }} colSpan='11' className="text-center">TIDAK ADA DATA</td>
                </tr>}
                {isiTabel}
            </tbody>
        </Table>


        const modalBody =
            <Form>
                <FormGroup inline>
                    {!this.TIPE && <strong>ID Karakteristik: </strong>}
                    {!this.TIPE && <Label>{this.props.currentChar.hprodchar_id}</Label>}
                </FormGroup>
                <FormGroup inline>
                    <strong>Nama Karakteristik: </strong>
                    {this.TIPE && <Input type="input" name="inputtedName" value={this.state.inputtedName} placeholder="Karakteristik (Maksimal 50 Karakter)"
                        onChange={this.setName} />}
                    {!this.TIPE && <Label>{this.props.currentChar.hprodchar_name}</Label>}
                </FormGroup>
                <FormGroup className="text-right">

                    {/* MODAL TAMBAH */}
                    <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                    <Modal
                        onExit={this.clearForm(this.TIPE)}
                        isOpen={this.state.modal_nested_parent}
                        toggle={this.toggle('nested_parent')}>
                        <ModalHeader toggle={this.toggle('nested_parent')}>
                            Tambah Point
                                    </ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label >Nama Point</Label>
                                    <Input type="textarea" name="inputtedPoint" value={this.state.inputtedPoint} onChange={evt => this.updateInputValue(evt.target.value, "dprodchar_name", "current")}
                                        placeholder="Nama Point (Maksimal 30 Karakter)" />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Nilai Point</Label>
                                    <Input type="number" name="inputtedNumber" value={this.state.inputtedNumber} onChange={evt => this.updateNumberValue(evt.target.value, "dprodchar_point", "current")}
                                        placeholder="Nilai Point" />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                Simpan
                                        </Button>
                            <Modal
                                onExit={this.clearForm(this.TIPE)}
                                isOpen={this.state.modal_nested}
                                toggle={this.toggle('nested')}>
                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                <ModalFooter>
                                    <Button color="primary" name="Tambah" onClick={this.updatePointTabel({ ...this.state.currentPoint })} disabled={loading}>
                                        {!loading && "Ya"}
                                        {loading && (
                                            <MdAutorenew />
                                        )}
                                        {loading && "Sedang diproses"}
                                    </Button>{' '}
                                    {!loading && <Button
                                        color="secondary"
                                        onClick={this.toggle('nested')}>
                                        Tidak
                                                </Button>}
                                </ModalFooter>
                            </Modal>
                            <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                Batal
                                        </Button>
                        </ModalFooter>
                    </Modal>

                    {/* MODAL EDIT */}
                    <Modal
                        onExit={this.clearForm(this.TIPE)}
                        isOpen={this.state.modal_nested_parent_edit}
                        toggle={this.toggle('nested_parent_edit')}>
                        <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                            Edit Point
                                    </ModalHeader>
                        <ModalBody>
                            <Form>{}
                                <FormGroup>
                                    <Label >Nama Point</Label>
                                    <Input type="textarea" name="inputtedPoint"
                                        value={this.state.editPoint && this.state.editPoint.dprodchar_name} onChange={evt => this.updateInputValue(evt.target.value, "dprodchar_name", "edit")} placeholder="Nama Point (Maksimal 30 Karakter)" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Nilai Point</Label>
                                    <Input type="number" name="inputtedNumber"
                                        value={this.state.editPoint && this.state.editPoint.dprodchar_point} onChange={evt => this.updateNumberValue(evt.target.value, "dprodchar_point", "edit")} placeholder="Nilai Point" />
                                </FormGroup>
                            </Form>

                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={!isEnabledEdit} color="primary" onClick={this.toggle('nested_edit')}>
                                Simpan
                                        </Button>
                            <Modal
                                onExit={this.clearForm(this.TIPE)}
                                isOpen={this.state.modal_nested_edit}
                                toggle={this.toggle('nested_edit')}>
                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                <ModalFooter>
                                    <Button name="btnEdit" color="primary" onClick={this.updatePointTabel({ ...this.state.editPoint })} disabled={loading}>
                                        {!loading && "Ya"}
                                        {loading && (
                                            <MdAutorenew />
                                        )}
                                        {loading && "Sedang diproses"}
                                    </Button>
                                    {!loading && <Button
                                        color="secondary"
                                        onClick={this.toggle('nested_edit')}>
                                        Tidak
                                                </Button>}
                                </ModalFooter>
                            </Modal>
                            <Button color="secondary" onClick={this.toggle('nested_parent_edit')}>
                                Batal
                                        </Button>
                        </ModalFooter>
                    </Modal>


                    {/* Modal Status */}
                    <Modal
                        isOpen={this.state.modal_statusData}
                        toggle={this.toggle('statusData')}>
                        <ModalHeader toggle={this.toggle('statusData')}>
                            {this.state.modal_statusDataTitle}
                        </ModalHeader>
                        <ModalBody>
                            <strong>ID Karakteristik: {this.state.karakterstatus && this.state.karakterstatus.dprodchar_id}</strong>
                            <br></br>
                            <strong>Nama: {this.state.karakterstatus && this.state.karakterstatus.dprodchar_name} </strong>
                            <br></br>
                            <br></br>
                            {this.state.modal_statusDataBody}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" name="btnStatus" onClick={this.setKarakterActiveYN(this.state.karakterstatus)} disabled={loading}>
                                {!loading && "Ya"}
                                {loading && (
                                    <MdAutorenew />
                                )}
                                {loading && "Sedang diproses"}
                            </Button>{' '}
                            {!loading && <Button color="secondary" onClick={this.toggle('statusData')}>
                                Tidak
                                        </Button>}
                        </ModalFooter>
                    </Modal>
                </FormGroup>
                {tabelPoint}
            </Form>

        //MAIN LAYOUT
        return <React.Fragment>
            <Modal isOpen={this.props.show} backdrop={true} toggle={this.props.toggleParent}>
                <ModalHeader >
                    {this.props.judul}
                </ModalHeader>
                <ModalBody>
                    {modalBody}
                </ModalBody>
                <ModalFooter>
                    <Button disabled={!isEnabledAdd} color="primary" onClick={this.props.toggleChild} >
                        Simpan
            </Button>
                    <Modal
                        onExit={this.props.handleClose}
                        isOpen={this.props.showChild}
                        toggle={this.props.toggleChild}>
                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                        <ModalBody>

                            Apakah Anda yakin ingin menyimpan data ini?
                        </ModalBody>
                        <ModalFooter>
                            <Button name="btnEdit" color="primary" onClick={this.props.processKarakter(this.state.inputtedName, this.state.result === null ? null : [...this.state.result])} disabled={this.props.loading}>
                                {!this.props.loading && "Ya"}
                                {this.props.loading && (
                                    <MdAutorenew />
                                )}
                                {this.props.loading && "Sedang diproses"}
                            </Button>
                            {!this.props.loading &&
                                <Button color="secondary" onClick={this.props.toggleChild}>
                                    Tidak
                    </Button>}
                        </ModalFooter>
                    </Modal>

                    <Button color="secondary" onClick={this.props.toggleParent}>
                        Batal
            </Button>
                </ModalFooter>
            </Modal>
            <script>
                    {document.onkeydown = (e) => {
                        var currentTodos = this.state.result.result;
                        const isEnabled = currentTodos ? true : false;
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.props.testFunc("nested");
                                    }
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.props.testFunc("nested");
                                    }
                                    e.preventDefault();
                                    break;
                            }
                        }
                        switch (e.key) {
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.insertMasterShortcut(this.state.inputtedName) }
                                // e.preventDefault();
                                break;
                            // f1
                            case "F1":
                                this.testFunc("nested_parent");
                                console.log(this.state.modal_nested_parent);
                                // document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3
                            case "F3":
                                // alert("untuk search");
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //f9
                            case "F9":
                                if(isEnabled===true)  {this.testFunc("nested_parent_delete");}
                                console.log(this.state.modal_nested_parent_delete);
                                // document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>
        </React.Fragment>
        




    }
}
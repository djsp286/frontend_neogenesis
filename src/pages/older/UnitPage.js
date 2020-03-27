import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight } from 'react-icons/md';

class UnitPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: ''
        };
    }


    componentDidMount() {
        this.setState({ isLoading: true });
        fetch('http://pharmanet.apodoc.id/neogenesisViewMasterUnit.php')
            .then(response => response.json())
            .then(data => this.setState({ result: data.result, isLoading: false }));
        this.toggle('nested_parent')
    }

    insertMasterUnit = param => () => {

        var url = `http://pharmanet.apodoc.id/neogenesisInsertMasterUnit.php?unit_name=${param}&unit_userid=0`;
        console.log(url);

        fetch(url)
            .then(response => {
                if (response.ok) {
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.componentDidMount();
                }
            });

    }

    setUnitActiveYN = (first_param, second_param) => () => {

        var url = `http://pharmanet.apodoc.id/neogenesisSetUnitActiveYN.php?unit_activeyn=${first_param}&unit_code=${second_param}`;
        console.log(url);

        fetch(url)
            .then(response => {
                if (response.ok) {
                    this.state.modal_backdrop = false;
                    this.componentDidMount();
                }
            });

    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    render() {
        const { result, isLoading } = this.state;

        console.log(result)

        return (
            <Page
                title="Unit"
                breadcrumbs={[{ name: 'unit', active: true }]}
                className="UnitPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                <SearchInput />
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Unit
                                </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Unit</Label>
                                        <Input type="namaunit" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namaunit" placeholder="Nama Unit" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                    </Button>
                                        <Modal
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.insertMasterUnit(this.state.inputtedName)}>
                                                    Ya
                                            </Button>{' '}
                                                <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                    </Button>
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nama Unit</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(unit =>
                                            <tr>
                                                <th scope="row">{unit.unit_code}
                                                </th>
                                                <td>{unit.unit_name}</td>
                                                {console.log(unit.unit_activeyn)}
                                                {unit.unit_activeyn === "Y" &&
                                                    <td>
                                                        <Badge color="success" className="mr-1">Aktif</Badge>
                                                    </td>
                                                }
                                                {unit.unit_activeyn !== "Y" &&
                                                    <td>
                                                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                                                    </td>
                                                }
                                                {unit.unit_activeyn === "Y" &&
                                                    <td>
                                                        <Button color="danger" size="sm" onClick={this.setUnitActiveYN('N', unit.unit_code)}><MdHighlightOff /></Button>
                                                        {/* <Modal
                                                            isOpen={this.state.modal_backdrop}
                                                            toggle={this.toggle('backdrop')}
                                                            backdrop={this.state.backdrop}>
                                                            <ModalHeader toggle={this.toggle('backdrop')}>Konfirmasi Penonaktifan</ModalHeader>
                                                            <ModalBody>
                                                                Apakah Anda yakin ingin menonaktifkan data ini?
                                                                                                </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="primary" onClick={this.setUnitActiveYN('N', unit.unit_runningid)}>
                                                                    Ya
                                                                                    </Button>{' '}
                                                                <Button color="secondary" onClick={this.toggle('backdrop')}>
                                                                    Tidak
                                                                                    </Button>
                                                            </ModalFooter>
                                                        </Modal> */}
                                                    </td>
                                                }
                                                {unit.unit_activeyn !== "Y" &&
                                                    <td>
                                                        <Button color="success" size="sm" onClick={this.setUnitActiveYN('Y', unit.unit_code)}><MdCheckCircle /></Button>
                                                        {/* <Modal
                                                            isOpen={this.state.modal_backdrop}
                                                            toggle={this.toggle('backdrop')}
                                                            backdrop={this.state.backdrop}>
                                                            <ModalHeader toggle={this.toggle('backdrop')}>Konfirmasi Penonaktifan</ModalHeader>
                                                            <ModalBody>
                                                                Apakah Anda ingin mengaktifkan data ini?
                                                                                        </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="primary" onClick={this.setUnitActiveYN('Y', unit.unit_runningid)}>
                                                                    Ya
                                                                            </Button>{' '}
                                                                <Button color="secondary" onClick={this.toggle('backdrop')}>
                                                                    Tidak
                                                                            </Button>
                                                            </ModalFooter>
                                                        </Modal> */}
                                                    </td>
                                                }
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

}
export default UnitPage;

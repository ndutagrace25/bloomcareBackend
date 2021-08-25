const objectid = require("mongodb").ObjectID;
const sequelize = require("sequelize");
const moment = require("moment");
//const dateFormat = require('dateformat');

const {
    Scout,
    Block,
    Tolerance,
    Bed,
    SubBlock,
    Entry,
    Point,
    Issue,
    Plant,
    Variety,
    Personnel,
    PersonnelType,
    IssueType
} = require("../models");

const {
    createError,
    createMessage,
    validateScoutInput,
    validateBedPrevalenceInput,
    isEmpty,
    validateId,
    validateScoutTimeReport
} = require("../validation");

const calculateThreatLevel = require("../utils/threatLevel");
const calculateParentThreatLevel = require("../utils/parentThreatLevel");
const calculateVarietyThreatLevel = require("../utils/calculateVarietyThreatLevel");

module.exports = {
    findScout(where, result) {
        return Scout.findOne(where)
            .then(scout => {
                return result(null, scout);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveScout(scout, personnelId, result) {
        //console.log(scout)
        const {
            errors,
            isValid
        } = validateScoutInput(scout);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            let newEntry = {
                date: scout.date,
                plant: objectid(scout.plant),
                entry: objectid(scout.entry),
                point: objectid(scout.point),
                issue: objectid(scout.issue),
                value: scout.value,
                longitude: scout.longitude,
                latitude: scout.latitude
            };

            if (scout.issueCategory != '') {
                newEntry['issueCategory'] = objectid(scout.issueCategory);
            }

            this.findScout(newEntry,
                (err, scoutDb) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {
                        if (scoutDb) {
                            const customError = createError({
                                scout: "Scout entry already exist"
                            });
                            result(customError, null);
                        } else {
                            // Get tolerance
                            this.getToleranceRating(scout.issue, scout.value, (err, tolerance) => {
                                if (err) {
                                    result(err, null);
                                } else {

                                    if (tolerance != null) {
                                        newEntry['tolerance'] = tolerance;
                                    }

                                    newEntry['personnel'] = scout.personnel;
                                    newEntry['created_by'] = objectid(personnelId);
                                    newEntry['modified_by'] = objectid(personnelId);
                                    Scout.create(newEntry)
                                        .then(() => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            const customError = createError(err);
                                            result(customError, null);
                                        });
                                }
                            });
                        }
                    }
                }
            );
        }
    },
    getToleranceRating(issue_id, value, result) {
        Issue
            .findOne({
                _id: issue_id
            })
            .populate("tolerance_type score")
            .then(issue => {
                let issueTolerance = null;
                Tolerance
                    .find({
                        tolerance_type: issue.tolerance_type._id
                    })
                    .then(tolerance => {
                        const totalTolerances = tolerance.length;

                        for (let r = 0; r < totalTolerances; r++) {
                            const to = tolerance[r].to;
                            const from = tolerance[r].from;
                            const tolerance_id = tolerance[r]._id;

                            if ((value >= from) && (value <= to)) {
                                issueTolerance = tolerance_id;
                            }
                        }

                        if (issueTolerance !== null) {
                            result(null, issueTolerance);
                        } else {
                            const customError = createError({
                                tolerance: "Value outside tolerance range"
                            });
                            result(customError, null);
                        }
                    })
                    .catch(err => {
                        result(err.message, null);
                    })
            })
    },
    getAllScouts(page, limit, date, entry, point, issue, tolerance, issueCategory, plant, value, latitude, longitude, created_by, result) {
        let where = {};

        if (!isEmpty(date)) {
            where["date"] = date;
        }

        if (!isEmpty(entry)) {
            where["entry"] = entry;
        }
        if (!isEmpty(point)) {
            where["point"] = point;
        }
        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        if (!isEmpty(tolerance)) {
            where["tolerance"] = tolerance;
        }
        if (!isEmpty(issueCategory)) {
            where["issueCategory"] = issueCategory;
        }
        if (!isEmpty(plant)) {
            where["plant"] = plant;
        }

        if (!isEmpty(value)) {
            where["value"] = {
                $regex: '^' + value,
                $options: 'i'
            };
        }

        if (!isEmpty(tolerance)) {
            where["tolerance"] = tolerance;
        }

        if (!isEmpty(latitude)) {
            where["latitude"] = {
                $regex: '^' + latitude,
                $options: 'i'
            };
        }
        if (!isEmpty(longitude)) {
            where["longitude"] = {
                $regex: '^' + longitude,
                $options: 'i'
            };
        }
        if (!isEmpty(created_by)) {
            where["created_by"] = {
                $regex: '^' + created_by,
                $options: 'i'
            };
        }
        //console.log("ppppp")
        return Scout
            .find(where)
            .populate({
                path: 'entry point  tolerance issueCategory plant issue created_by',
                populate: {
                    path: 'issue_type score tolerance_type bed variety',
                    populate: {
                        path: 'block',
                        populate: 'parent'
                    }
                },
            })
            .limit(limit)
            .skip(page * limit)
            .sort([['date', -1]])
            .exec()
            .then(scout => {
                //console.log(scout)
                this.countScout(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: scout
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    countScout(where, result) {
        return Scout.countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    getThreatLevel(tolerance_name, result) {
        let threat = null;
        switch (tolerance_name) {
            case "Score 1":
            case "Score 2":
                threat = "Success";
                break;
            case "Score 3":
            case "Score 4":
                threat = "Warning";
                break;
            case "Score 5":
                threat = "Danger";
                break;
            default:
                threat = "Success";
        }
        result(null, threat);
    },
    getFarm(result) {
        return Block
            .find({
                "parent": {
                    $exists: false
                }
            })
            .sort({
                number: 1
            })
            .then(parentBlocks => {
                IssueType
                    .find()
                    .then((allIssueTypes) => {
                        Scout
                            .find({
                                "date": {
                                    $gte: new Date((new Date().getTime() - (5 * 24 * 60 * 60 * 1000)))
                                }
                            })
                            //.find()
                            .populate({
                                path: 'entry point issue tolerance issueCategory plant',
                                populate: {
                                    path: 'issue_type score bed variety tolerance_type',
                                    populate: {
                                        path: 'block',
                                        populate: 'parent'
                                    },
                                }
                            })

                            .then(scouts => {
                                //  console.log(scouts)
                                let farmArray = [];
                                let issueTypeAlert;
                                let parentAlert;
                                let parent_threat_level = "Default";
                                for (let c = 0; c < parentBlocks.length; c++) {

                                    const block_id = parentBlocks[c]._id;
                                    const block_name = parentBlocks[c].name;
                                    parentAlert = {
                                        block_id,
                                        block_name,
                                        scout_alert: "default",
                                        block_issue_types: [],
                                    };
                                    let scoutEntries;
                                    let threat_level = "Default";
                                    let scoutBlockEntries = scouts
                                        .filter(scout => scout.plant.bed.block.parent._id.equals(block_id));

                                    if (scoutBlockEntries.length > 0) {
                                        parentAlert["scout_alert"] = "Success";

                                        for (let p = 0; p < allIssueTypes.length; p++) {

                                            const issueTypeId = allIssueTypes[p]._id;
                                            const issueTypeName = allIssueTypes[p].name;
                                            issueTypeAlert = {
                                                issue_type_name: issueTypeName,
                                                alert: "Default",
                                            };
                                            scoutEntries = scoutBlockEntries
                                                .filter(scout => scout.issue.issue_type._id.equals(issueTypeId));

                                            for (let j = 0; j < scoutEntries.length; j++) {
                                                const score_name = scoutEntries[j].issue.score.name;
                                                const tolerance_name = (scoutEntries[j].tolerance) ? scoutEntries[j].tolerance.name : null;
                                                const value = scoutEntries[j].value;
                                                const issue_type = scoutEntries[j].issue.issue_type.name;
                                                threat_level = calculateThreatLevel(threat_level, score_name,
                                                    tolerance_name, value, issue_type);
                                                issueTypeAlert["alert"] = threat_level

                                            }
                                            parentAlert.block_issue_types.push(issueTypeAlert)
                                            // console.log(parentAlert.block_issue_types)
                                        }
                                    } else {
                                        parentAlert["scout_alert"] = "Danger";
                                        for (let n = 0; n < allIssueTypes.length; n++) {
                                            const issueTypeName = allIssueTypes[n].name;
                                            issueTypeAlert = {
                                                issue_type_name: issueTypeName,
                                                alert: "",
                                            };
                                            issueTypeAlert["alert"] = "default"
                                            parentAlert.block_issue_types.push(issueTypeAlert)
                                        }
                                    }
                                    let parentThreatLevelArr = [];
                                    parentThreatLevelArr.push(parentAlert)
                                    let alertArray = [];
                                    for (let t = 0; t < parentThreatLevelArr.length; t++) {
                                        const scoutAlert = parentThreatLevelArr[t].scout_alert;
                                        alertArray.push(scoutAlert)
                                        let childArray = parentThreatLevelArr[t].block_issue_types;
                                        for (let k = 0; k < childArray.length; k++) {
                                            const scoutIssueAlert = childArray[k].alert;
                                            alertArray.push(scoutIssueAlert)

                                            for (let h = 0; h < alertArray.length; h++) {
                                                let alert = alertArray[h];
                                                parent_threat_level = calculateParentThreatLevel(parent_threat_level,
                                                    alert);
                                            }
                                        }
                                        parentAlert["alert"] = parent_threat_level;
                                    }
                                    farmArray.push(parentAlert);
                                }
                                result(null,
                                    farmArray
                                );
                            })
                            .catch(err => {
                                result(err, null);
                            });
                    })
                    .catch(err => {
                        result(err, null);
                    });
            })
            .catch(err => {
                result(err, null);
            });
    },
    getBlockReport(block, result) {
        // Need to validate block
        let where = {};
        where["block"] = block;
        Block
            .find({
                parent: block
            })
            .populate('parent')
            .then((blockFetched) => {
                let childBlockIdArray = [];

                for (let k = 0; k < blockFetched.length; k++) {
                    const childBlockId = blockFetched[k]._id;
                    childBlockIdArray.push(childBlockId)
                }

                const block_name = blockFetched[0].parent.name;
                Bed
                    .find({
                        block: {
                            "$in": childBlockIdArray
                        }
                    })
                    .populate([{
                        path: 'block',
                        populate: {
                            path: 'parent'
                        }
                    }])
                    .then((dbBeds) => {

                        const allBeds = dbBeds.sort(function (a, b) {
                            return a.number - b.number;
                        });

                        Scout
                            .find({
                                "date": {
                                    $gte: new Date((new Date().getTime() - (5 * 24 * 60 * 60 * 1000)))
                                }
                            })
                            .populate({
                                path: 'entry point issue tolerance issueCategory plant',
                                populate: {
                                    path: 'issue_type score tolerance_type bed variety',
                                    populate: {
                                        path: 'block',
                                        populate: 'parent'
                                    },
                                }
                            })
                            .then(scouts => {
                                let beds = [];
                                for (let p = 0; p < allBeds.length; p++) {
                                    const bed_id = allBeds[p]._id;
                                    const bed_name = allBeds[p].bed_name;
                                    const bed_number = allBeds[p].number;
                                    //  const child_block_name = allBeds[p].block.name;
                                    const child_block_id = allBeds[p].block._id;
                                    let BedAlert = {
                                        bed_id,
                                        bed_number,
                                        bed_name
                                    };
                                    let threat_level = "Default";
                                    const scoutBedsArr = scouts
                                        .filter(scout => scout.plant.bed.block._id.equals(child_block_id) && scout.plant.bed._id.equals(bed_id));

                                    for (let j = 0; j < scoutBedsArr.length; j++) {
                                        const score_name = scoutBedsArr[j].issue.score.name;
                                        const tolerance_name = (scoutBedsArr[j].tolerance) ? scoutBedsArr[j].tolerance.name : null;
                                        const value = scoutBedsArr[j].value;
                                        const issue_type = scoutBedsArr[j].issue.issue_type.name;
                                        threat_level = calculateThreatLevel(threat_level, score_name, tolerance_name, value, issue_type);
                                    }

                                    BedAlert["alert"] = threat_level;
                                    beds.push(BedAlert);
                                }
                                result(null, {
                                    block_name,
                                    beds
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            });
                    })
            })
            .catch(err => {
                result(err, null);
            });
    },
    getBlockPrintReport(block, variety, created_by, created, issue, result) {
        let where = {};
        let plantWhere = {};

        let startDate = moment(created);
        const today = moment().startOf('day');

        if (!isEmpty(created_by)) {
            where["created_by"] = created_by;
        }
        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        if (!isEmpty(created)) {
            where["date"] = {
                "$gte": startDate,
                "$lt": moment(startDate).add(1, 'days')
            };
        } else {
            where["date"] = {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            };
        }
        if (!isEmpty(variety)) {
            plantWhere['variety'] = variety;
        }
        Block
            .find({
                parent: block
            })
            .then((subblocks) => {
                const bedBlock = subblocks.map(function (obj) {
                    return obj._id;
                });
                Bed
                    .find({
                        block: {
                            "$in": bedBlock
                        }
                    })
                    .populate([{
                        path: 'block',
                        populate: {
                            path: 'parent'
                        }
                    }])
                    .then((dbBeds) => {
                        const allBlockBeds = dbBeds.map(function (obj) {
                            return objectid(obj._id);
                        });

                        plantWhere['bed'] = {
                            "$in": allBlockBeds
                        };

                        Plant
                            .find(plantWhere)
                            .populate({
                                path: 'bed variety',
                                populate: {
                                    path: 'block'
                                },
                            })
                            .sort({
                                number: -1
                            })
                            .then((allPlants) => {
                                const plants = allPlants.sort(function (a, b) {
                                    return a.bed.number - b.bed.number;
                                });

                                Entry
                                    .find()
                                    .then(entries => {
                                        Scout
                                            .find(where)
                                            .populate({
                                                path: 'entry point issue tolerance issueCategory plant created_by',
                                                populate: {
                                                    path: 'issue_type score tolerance_type bed',
                                                    populate: {
                                                        path: 'block ',
                                                    }
                                                },
                                            })
                                            .then(scouts => {

                                                let bedArray = [];
                                                for (let b = 0; b < plants.length; b++) {
                                                    const bed = plants[b].bed;
                                                    const variety = plants[b].variety;
                                                    let scoutingPersonnel;
                                                    let scoutingDate;

                                                    const bed_id = bed._id;
                                                    const bedName = bed.bed_name;
                                                    const bedNumber = bed.bed_number;
                                                    const bedBlockName = bed.block.name;

                                                    let currentBed = {
                                                        bed_name: bedName,
                                                        bed_id: bed_id,
                                                        bed_number: bedNumber,
                                                        bed_block_name: bedBlockName,
                                                        variety: variety.name,
                                                        personnel: "",
                                                        date: "",
                                                        stations: []
                                                    };

                                                    for (let t = 0; t < entries.length; t++) {
                                                        const entry_id = entries[t]._id;
                                                        const entry_name = entries[t].name;
                                                        let currentEntry = {
                                                            entry_name: entry_name,
                                                            entry_id: entry_id,
                                                            alert: ""
                                                        };
                                                        let threat_level = "Default";
                                                        const scoutEntries = scouts
                                                            .filter(scout => scout.plant.bed.block.name === bed.block.name && scout.plant.bed.bed_name === bed.bed_name && scout.entry.name === entry_name);
                                                        if (scoutEntries.length > 0) {
                                                            for (let j = 0; j < scoutEntries.length; j++) {
                                                                const currentScout = scoutEntries[j];
                                                                scoutingPersonnel = currentScout.created_by;
                                                                scoutingDate = currentScout.created;
                                                                const value = currentScout.value;
                                                                const tolerance_name = (currentScout.tolerance) ? currentScout.tolerance.name : null;
                                                                const score_name = currentScout.issue.score.name;
                                                                const issue_type = currentScout.issue.issue_type.name;

                                                                threat_level = calculateThreatLevel(threat_level, score_name, tolerance_name, value, issue_type);
                                                            }
                                                        }

                                                        currentEntry["alert"] = threat_level;
                                                        currentBed["stations"].push(currentEntry);
                                                    }
                                                    currentBed["created_by"] = scoutingPersonnel;
                                                    currentBed["scoutDate"] = scoutingDate;

                                                    bedArray.push(currentBed);
                                                }
                                                result(null, bedArray);
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            });
                                    })
                            })
                            .catch(err => {
                                result(err, null);
                            });
                    })
                    .catch(err => {

                    });

            })
            .catch(err => {
                result(err, null);
            });
    },
    getBeds(bed, created, result) {

        let where = {};
        let startDate = moment(created);
        const today = moment().startOf('day');

        if (!isEmpty(created)) {
            where["date"] = {
                "$gte": startDate,
                "$lt": moment(startDate).add(1, 'days')
            };
        } else {
            where["date"] = {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            };
        }
        let searchDate;
        if (!isEmpty(created)) {
            searchDate = created;
        } else {
            searchDate = today;
        }
        Bed
            .findOne({
                _id: bed
            })
            .then((bedFetched) => {
                const fetchedBedId = bedFetched._id;
                const bed_number = bedFetched.bed_number;
                const bed_name = bedFetched.bed_name;
                Entry
                    .find()
                    .then((allEntries) => {

                        Scout
                            .find(where)
                            .populate({
                                path: 'entry point issue tolerance issueCategory plant',
                                populate: {
                                    path: 'issue_type score tolerance_type bed variety',
                                    populate: {
                                        path: 'block',
                                        populate: 'parent'
                                    },
                                }
                            })
                            .then(scouts => {

                                let bedArray = [];
                                for (let c = 0; c < allEntries.length; c++) {
                                    const entry_id = allEntries[c]._id;
                                    const entry_name = allEntries[c].name;
                                    let EntryAlert = {
                                        entry_id: entry_id,
                                        entry_name: entry_name,
                                        date: "",
                                        alert: ""
                                    };
                                    let threat_level = "Default";

                                    let scoutedEntries = scouts
                                        .filter(scout => scout.plant.bed._id.equals(bed) && scout.entry._id.equals(entry_id));

                                    for (let j = 0; j < scoutedEntries.length; j++) {
                                        const score_name = scoutedEntries[j].issue.score.name;
                                        const tolerance_name = (scoutedEntries[j].tolerance) ? scoutedEntries[j].tolerance.name : null;
                                        const value = scoutedEntries[j].value;
                                        const issue_type = scoutedEntries[j].issue.issue_type.name;
                                        threat_level = calculateThreatLevel(threat_level, score_name, tolerance_name, value, issue_type);
                                    }
                                    EntryAlert["date"] = searchDate;
                                    EntryAlert["alert"] = threat_level;
                                    bedArray.push(EntryAlert);
                                }
                                result(null, {
                                    fetchedBedId,
                                    bed_name,
                                    bed_number,
                                    bedArray
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            });
                    })
            })
            .catch(err => {
                result(err, null);
            });
    },
    getEntries(entry, bed, date, result) {

        let where = {};
        let startDate = moment(date);
        const today = moment().startOf('day');

        if (!isEmpty(entry)) {
            where["entry"] = entry;
        }

        if (!isEmpty(date)) {
            where["date"] = {
                "$gte": startDate,
                "$lt": moment(startDate).add(1, 'days')
            };
        } else {
            where["date"] = {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            };
        }

        Entry
            .findOne({
                _id: entry
            })
            .then((fetchedEntry) => {

                const fetchedEntryId = fetchedEntry._id;
                const fetchedEntryName = fetchedEntry.name;

                Scout
                    .find(where)
                    .populate({
                        path: 'entry point issue tolerance issueCategory plant',
                        populate: {
                            path: 'issue_type score tolerance_type bed variety',
                            populate: {
                                path: 'block',
                                populate: 'parent'
                            },
                        }
                    })
                    .then(scouts => {
                        let entryArray = [];
                        let issueName;
                        let issueCategory;
                        let issueTypeName;
                        let value;
                        let score_name;

                        let scoutedPoints = scouts
                            .filter(scout => scout.plant.bed._id.equals(bed));

                        for (let c = 0; c < scoutedPoints.length; c++) {

                            let scoutPointName = scoutedPoints[c].point.name;
                            let scoutPointId = scoutedPoints[c].point._id;
                            let threat_level = "Default";
                            let PointAlert = {
                                point_id: scoutPointId,
                                point_name: scoutPointName,
                                issue_name: "",
                                issue_category: "",
                                issue_type_name: "",
                                scoring: "",
                                value: "",
                                alert: ""
                            };
                            issueName = scoutedPoints[c].issue.issue_name;
                            issueCategory = (scoutedPoints[c].issueCategory) ? scoutedPoints[c].issueCategory.name : null;
                            issueTypeName = scoutedPoints[c].issue.issue_type.name;
                            score_name = scoutedPoints[c].issue.score.name;
                            const tolerance_name = (scoutedPoints[c].tolerance) ? scoutedPoints[c].tolerance.name : null;
                            const issue_type = scoutedPoints[c].issue.issue_type.name;
                            value = scoutedPoints[c].value;
                            threat_level = calculateThreatLevel(threat_level, score_name, tolerance_name, value, issue_type);
                            PointAlert["issue_name"] = issueName;
                            PointAlert["issue_category"] = issueCategory;
                            PointAlert["issue_type_name"] = issueTypeName;
                            PointAlert["scoring"] = score_name;
                            PointAlert["value"] = value;
                            PointAlert["alert"] = threat_level;
                            entryArray.push(PointAlert);
                        }
                        result(null, {
                            fetchedEntryId,
                            fetchedEntryName,
                            entryArray,
                        });
                    })
                    .catch(err => {
                        result(err, null);
                    });

            })
            .catch(err => {
                result(err, null);
            });
    },
    getAllScoutsPersonnel(
        personnelId,
        date,
        plant,
        entry,
        point,
        issue,
        issueCategory,
        value,
        result
    ) {
        let where = {
            created_by: personnelId
        };

        if (!isEmpty(date)) {
            where["date"] = date;
        }
        if (!isEmpty(plant)) {
            where["plant"] = plant;
        }
        if (!isEmpty(entry)) {
            where["entry"] = entry;
        }
        if (!isEmpty(point)) {
            where["point"] = point;
        }
        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        if (!isEmpty(issueCategory)) {
            where["issueCategory"] = issueCategory;
        }
        if (!isEmpty(value)) {
            where["value"] = value;
        }

        return Scout
            .find(where)
            .populate({
                path: "plant entry point issue issueCategory tolerance",
                populate: {
                    path: "bed variety issue_type score tolerance_type",
                    populate: {
                        path: "block",
                        populate: "parent"
                    }
                }
            })
            .sort({
                created: "asc"
            })
            .exec()
            .then(scout => {
                this.countScout(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: scout
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    getBedScoutingDate(bed, result) {
        let where = {};

        if (!isEmpty(bed)) {
            where["bed"] = bed;
        }
        Bed
            .findById(bed)
            .then((bedFetched) => {
                // console.log(bedFetched)
                const queryBedName = bedFetched.bed_name;

                Scout
                    .find()
                    .populate({
                        path: 'entry point issue tolerance issueCategory plant ',
                        populate: {
                            path: 'issue_type score tolerance_type bed variety',
                            populate: {
                                path: 'block ',
                            }
                        },
                    })
                    .then(scout => {
                        let bedName;
                        let uniqueDates = [];
                        for (let j = 0; j < scout.length; j++) {
                            bedName = scout[j].plant.bed.bed_name;

                            if (bedName == queryBedName) {
                                const scoutingDate = scout[j].created;

                                let date = new Date(scoutingDate);
                                date = date.toISOString().slice(0, 10);

                                let unidates = [new Date(), new Date(date)]

                                uniqueDates = unidates
                                    .map(s => s.toString())
                                    .filter((s, i, a) => a.indexOf(s) == i)
                                    .map(s => new Date(s));
                            }
                        }
                        result(null, uniqueDates);
                    })
                    .catch(err => {
                        result(err, null);
                    });

            })
            .catch(err => {
                result(err, null);
            });
    },
    getBlockScoutingDate(block, result) {
        let where = {};
        if (!isEmpty(block)) {
            where["block"] = block;
        }
        Block
            .findById(block)
            .then((fetchedParentBlock) => {
                const parentBlockId = fetchedParentBlock._id;

                Block
                    .find({
                        parent: block
                    })
                    .then((subblock) => {

                        return Bed
                            .find()
                            .populate("block")
                            .then(beds => {

                                Scout
                                    .find()
                                    .populate({
                                        path: 'entry point issue tolerance issueCategory plant ',
                                        populate: {
                                            path: 'issue_type score tolerance_type bed variety',
                                            populate: {
                                                path: 'block ',
                                            }
                                        },
                                    })
                                    .then(scout => {

                                        let blockName;
                                        let uniqueDates = [];

                                        for (let m = 0; m < subblock.length; m++) {
                                            const subBlock = subblock[m].name;

                                            for (let r = 0; r < beds.length; r++) {
                                                blockName = beds[r].block.name;
                                                if (blockName == subBlock) {
                                                    for (let j = 0; j < scout.length; j++) {
                                                        const scoutingDate = scout[j].created;
                                                        let date = new Date(scoutingDate);
                                                        // date = date.toISOString().slice(0, 10);
                                                        let unidates = [new Date(), new Date(date)]
                                                        uniqueDates = unidates
                                                            .map(s => s.toString())
                                                            .filter((s, i, a) => a.indexOf(s) == i)
                                                            .map(s => new Date(s));
                                                    }
                                                }
                                            }
                                        }
                                        result(null, {
                                            block: parentBlockId,
                                            dates: uniqueDates
                                        });
                                        // result(null, uniqueDates);
                                    })
                                    .catch(err => {
                                        result(err, null);
                                    });
                            })
                    })
                    .catch(err => {
                        result(err, null);
                    });
            })
            .catch(err => {
                result(err, null);
            });

    },
    fetchAllScoutsWithoutPagination(date, entry, point, issue, tolerance, issueCategory, plant, value, latitude, longitude, created_by, result) {

        let where = {};

        if (!isEmpty(date)) {
            where["date"] = date;
        }

        if (!isEmpty(entry)) {
            where["entry"] = entry;
        }
        if (!isEmpty(point)) {
            where["point"] = point;
        }
        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        if (!isEmpty(tolerance)) {
            where["tolerance"] = tolerance;
        }
        if (!isEmpty(issueCategory)) {
            where["issueCategory"] = issueCategory;
        }
        if (!isEmpty(plant)) {
            where["plant"] = plant;
        }

        if (!isEmpty(value)) {
            where["value"] = {
                $regex: '^' + value,
                $options: 'i'
            };
        }

        if (!isEmpty(tolerance)) {
            where["tolerance"] = tolerance;
        }

        if (!isEmpty(latitude)) {
            where["latitude"] = {
                $regex: '^' + latitude,
                $options: 'i'
            };
        }
        if (!isEmpty(longitude)) {
            where["longitude"] = {
                $regex: '^' + longitude,
                $options: 'i'
            };
        }
        if (!isEmpty(created_by)) {
            where["created_by"] = {
                $regex: '^' + created_by,
                $options: 'i'
            };
        }

        return Scout
            .find(where)
            .populate({
                path: 'entry point  tolerance issueCategory plant issue created_by',
                populate: {
                    path: 'issue_type score tolerance_type bed variety',
                    populate: {
                        path: 'block',
                        populate: 'parent'
                    }
                },
            })
            .sort({
                created: "asc"
            })
            .exec()
            .then(scout => {
                result(null, scout);
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateTolerance(result) {
        let diseaseArray = ["5d87dbaabecb722b4d2f22c4", "5d87dbc0becb722b4d2f22c5", "5d87dbd0becb722b4d2f22c6"]
        Scout
            .find({
                issue: {
                    "$in": diseaseArray
                }
            })
            .exec()
            .then(scouts => {
                let tolerancePromises = [];
                let scoutPromises = [];
                let updated = [];
                let errors = [];

                for (let r = 0; r < scouts.length; r++) {
                    const scout = scouts[r];
                    const issue_id = scout.issue;
                    const value = scout.value;

                    tolerancePromises.push(
                        Issue
                            .findOne({
                                _id: issue_id
                            })
                            .populate("tolerance_type score")
                            .then(issue => {
                                let issueTolerance = null;
                                Tolerance
                                    .find({
                                        tolerance_type: issue.tolerance_type._id
                                    })
                                    .then(tolerance => {
                                        const totalTolerances = tolerance.length;

                                        for (let r = 0; r < totalTolerances; r++) {
                                            const to = tolerance[r].to;
                                            const from = tolerance[r].from;
                                            const tolerance_id = tolerance[r]._id;

                                            // if ((value >= from) && (value <= to)) {
                                            //     issueTolerance = tolerance_id;
                                            // }
                                            if (value == 1) {
                                                issueTolerance = objectid('5d87d9dcbecb722b4d2f22b7');
                                            }
                                        }

                                        if (issueTolerance !== null) {

                                            scoutPromises.push(
                                                Scout.findOneAndUpdate({
                                                    _id: scout._id
                                                }, {
                                                    $set: {
                                                        tolerance: issueTolerance
                                                    }
                                                }, {
                                                    new: true,
                                                    useFindAndModify: false
                                                })
                                                    .then(updatedScout => {
                                                        updated.push(updatedScout);
                                                    })
                                                    .catch(err => {
                                                        errors.push(err.message);
                                                    })
                                            )
                                        } else {
                                            errors.push(scout._id);
                                        }
                                    })
                                    .catch(err => {
                                        errors.push(err.message);
                                    })
                            })
                    );
                }

                Promise
                    .all(tolerancePromises)
                    .then(() => {
                        Promise
                            .all(scoutPromises)
                            .then(() => {
                                // console.log(updated);
                                result(null, {
                                    message: 'Success'
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    })
            })
            .catch(err => {
                result(err, null);
            });
    },
    getScoutReportingDate(filter, block, result) {

        let where = {};

        let startDate = moment(filter);
        let today = moment();

        if (!isEmpty(filter)) {
            where["date"] = {
                "$gte": startDate,
                "$lt": moment(startDate).add(1, 'days')
            };
        } else {
            where["date"] = {
                "$gte": today,
                "$lt": moment(today).add(1, 'days')
            };
        }
        Bed
            .find()
            .populate({
                path: 'block',
                populate: {
                    path: 'parent'
                }
            })
            .then((dbBeds) => {
                PersonnelType
                    .findOne({
                        name: 'Scout'
                    })
                    .then(personnelType => {
                        if (personnelType._id) {
                            Personnel
                                .find({
                                    personnel_type_id: personnelType._id
                                })
                                .then(personnel => {
                                    if (personnel.length > 0) {

                                        Scout
                                            .find(where)
                                            .sort({
                                                date: 'asc'
                                            })
                                            .populate({
                                                path: 'entry point tolerance issueCategory plant issue created_by',
                                                populate: {
                                                    path: 'issue_type score tolerance_type bed variety',
                                                    populate: {
                                                        path: 'block',
                                                        populate: 'parent'
                                                    }
                                                },
                                            })
                                            .then(scouts => {

                                                let scoutBed;
                                                let scoutTime;
                                                let scoutBlock;
                                                let blockAverangeTimeDec;
                                                let bedAverageTimeDec;
                                                let allBlocksAverageTime;
                                                let totalScoutTimeArr = [];
                                                let scoutBedArr = [];
                                                let scoutBlockArr = [];
                                                let uniqueBedArr;
                                                let uniqueBlockArr;
                                                let stationAverageTimeDec;

                                                let personnelObj;
                                                let blockAverageTime;
                                                let bedAverageTime;
                                                let stationAverageTime;
                                                const personnelArray = [];
                                                let scoutEntries;

                                                let timeArray = [];

                                                for (let s = 0; s < personnel.length; s++) {

                                                    const personnelId = personnel[s]._id;
                                                    const personnelName = personnel[s].first_name;

                                                    personnelObj = {
                                                        personnel_id: personnelId,
                                                        personnel_name: personnelName,
                                                        average_block_time: "",
                                                        average_bed_time: "",
                                                        average_station_time: "",
                                                        scouted_blocks: "",
                                                        total_beds: "",
                                                        scouted_beds: "",
                                                        total_stations: "",
                                                        scouted_stations: "",
                                                    };


                                                    if (!isEmpty(block)) {

                                                        scoutEntries = scouts
                                                            .filter(scout => scout.plant.bed.block.parent._id.equals(block));

                                                    } else {
                                                        scoutEntries = scouts;
                                                    }
                                                    for (let r = 0; r < scoutEntries.length; r++) {
                                                        const scoutPersonnelId = scoutEntries[r].created_by._id;

                                                        if (personnelId.equals(scoutPersonnelId)) {

                                                            scoutBlock = scoutEntries[r].plant.bed.block.parent._id;
                                                            scoutBed = scoutEntries[r].plant.bed._id;
                                                            scoutTime = scoutEntries[r].date;
                                                            scoutBlockArr.push(scoutBlock)
                                                            totalScoutTimeArr.push(scoutTime);
                                                            scoutBedArr.push(scoutBed);
                                                            uniqueBedArr = scoutBedArr.filter((item, i, ar) => ar.indexOf(item) === i);
                                                            uniqueBlockArr = scoutBlockArr.filter((item, i, ar) => ar.indexOf(item) === i);
                                                            const scoutBlockNumber = uniqueBlockArr.length;
                                                            const maxScoutDate = new Date(Math.max.apply(null, totalScoutTimeArr));

                                                            const scoutPerPersonnel = totalScoutTimeArr.length;
                                                            const minScoutDate = new Date(Math.min.apply(null, totalScoutTimeArr));
                                                            allBlocksAverageTime = (maxScoutDate.getTime() - minScoutDate.getTime()) / 1000;
                                                            allBlocksAverageTime /= 60;
                                                            blockAverangeTimeDec = allBlocksAverageTime / scoutBlockNumber;
                                                            blockAverageTime = Math.round(blockAverangeTimeDec)
                                                            const scoutBedNumber = uniqueBedArr.length;
                                                            const totalBedNumArr = [];
                                                            let totalBedNum;
                                                            let totalStations;
                                                            for (let u = 0; u < uniqueBlockArr.length; u++) {
                                                                const uniqueBlockId = uniqueBlockArr[u];
                                                                for (let b = 0; b < dbBeds.length; b++) {
                                                                    const blockBedId = dbBeds[b].block.parent._id;
                                                                    if (uniqueBlockId.equals(blockBedId)) {
                                                                        const uni = uniqueBlockId;
                                                                        totalBedNumArr.push(uni);
                                                                        totalBedNum = totalBedNumArr.length;
                                                                        totalStations = totalBedNum * 10;
                                                                    }
                                                                }
                                                            }

                                                            bedAverageTimeDec = allBlocksAverageTime / scoutBedNumber;
                                                            bedAverageTime = Math.round(bedAverageTimeDec)
                                                            stationAverageTimeDec = allBlocksAverageTime / scoutPerPersonnel;
                                                            stationAverageTime = Math.round(stationAverageTimeDec);
                                                            personnelObj["personnel_name"] = personnelName;
                                                            personnelObj["average_block_time"] = blockAverageTime;
                                                            personnelObj["average_bed_time"] = bedAverageTime;
                                                            personnelObj["average_station_time"] = stationAverageTime;
                                                            personnelObj["scouted_blocks"] = scoutBlockNumber;
                                                            personnelObj["total_beds"] = totalBedNum;
                                                            personnelObj["scouted_beds"] = scoutBedNumber;
                                                            personnelObj["total_stations"] = totalStations;
                                                            personnelObj["scouted_stations"] = scoutPerPersonnel;
                                                        }
                                                    }
                                                    personnelArray.push(personnelObj)
                                                }

                                                result(null, personnelArray);

                                            })
                                            .catch(err => {
                                                const customError = createError(err.message);
                                                result(customError, null);
                                            })
                                    } else {
                                        const customError = createError("scouts not found");
                                        result(customError, null);
                                    }
                                })
                                .catch(err => {
                                    result(err, null);
                                });
                        } else {
                            const customError = createError("Personnel Type Scout not found");
                            result(customError, null);
                        }
                    })
            })
            .catch(err => {
                result(err, null);
            })
            .catch(err => {
                result(err, null);
            })
    },
    // getScoutReportingDate(filter, block, result) {

    //     let where = {};

    //     let startDate = moment(filter);
    //     let today = moment();

    //     if (!isEmpty(filter)) {
    //         where["date"] = {
    //             "$gte": startDate,
    //             "$lt": moment(startDate).add(1, 'days')
    //         };
    //     } else {
    //         where["date"] = {
    //             "$gte": today,
    //             "$lt": moment(today).add(1, 'days')
    //         };
    //     }
    //     Bed
    //         .find()
    //         .populate({
    //             path: 'block',
    //             populate: {
    //                 path: 'parent'
    //             }
    //         })
    //         .then((dbBeds) => {
    //             PersonnelType
    //                 .findOne({
    //                     name: 'Scout'
    //                 })
    //                 .then(personnelType => {
    //                     if (personnelType._id) {
    //                         Personnel
    //                             .find({
    //                                 personnel_type_id: personnelType._id
    //                             })
    //                             .then(personnel => {
    //                                 if (personnel.length > 0) {

    //                                     Scout
    //                                         .find(where)
    //                                         .sort({
    //                                             date: 'asc'
    //                                         })
    //                                         .populate({
    //                                             path: 'entry point tolerance issueCategory plant issue',
    //                                             populate: {
    //                                                 path: 'issue_type score tolerance_type bed variety',
    //                                                 populate: {
    //                                                     path: 'block',
    //                                                     populate: 'parent'
    //                                                 }
    //                                             },
    //                                         })
    //                                         .then(scouts => {
    //                                             //console.log(scouts)

    //                                             let scoutBed;
    //                                             let scoutTime;
    //                                             let scoutBlocks;
    //                                             let blockAverangeTimeDec;
    //                                             let bedAverageTimeDec;
    //                                             let allBlocksAverageTime;
    //                                             let totalScoutTimeArr = [];
    //                                             let scoutBedArr = [];
    //                                             let scoutBlockArr = [];
    //                                             let uniqueBedArr;
    //                                             let uniqueBlockArr;
    //                                             let stationAverageTimeDec;

    //                                             let personnelObj;
    //                                             let blockAverageTime;
    //                                             let bedAverageTime;
    //                                             let stationAverageTime;
    //                                             const personnelArray = [];
    //                                             let scoutEntries;
    //                                             let scoutBedTime;
    //                                             let totalScoutBedTimeArr = [];
    //                                             let allBedsAverageTime;

    //                                             let scoutPersonnelArr = [];
    //                                             let bedAverageTimeArr = [];

    //                                             for (let s = 0; s < personnel.length; s++) {

    //                                                 const personnelId = personnel[s]._id;
    //                                                 // console.log(personnelId)
    //                                                 const personnelName = personnel[s].first_name;

    //                                                 personnelObj = {
    //                                                     personnel_id: personnelId,
    //                                                     personnel_name: personnelName,
    //                                                     average_block_time: "",
    //                                                     average_bed_time: "",
    //                                                     average_station_time: "",
    //                                                     scouted_blocks: "",
    //                                                     total_beds: "",
    //                                                     scouted_beds: "",
    //                                                     total_stations: "",
    //                                                     scouted_stations: "",
    //                                                 };
    //                                                 scoutPersonnelArr = scouts
    //                                                     .filter(scout => scout.created_by._id.equals(personnelId));

    //                                                 scoutBlocks = scoutPersonnelArr
    //                                                     .filter(scoutPersonnel => scoutPersonnel.plant.bed.block.parent._id.equals(block));

    //                                                 let scoutBedIds = scoutBlocks.map(function (scout) {
    //                                                     return scout.plant.bed._id;
    //                                                 });

    //                                                 let uniquescoutBedIds = [...new Set(scoutBedIds)];

    //                                                 for (let r = 0; r < scoutBlocks.length; r++) {

    //                                                     scoutTime = scoutBlocks[r].date;
    //                                                     totalScoutTimeArr.push(scoutTime);
    //                                                     const maxScoutDate = new Date(Math.max.apply(null, totalScoutTimeArr))
    //                                                     const minScoutDate = new Date(Math.min.apply(null, totalScoutTimeArr));
    //                                                     allBlocksAverageTime = (maxScoutDate.getTime() - minScoutDate.getTime()) / 1000;
    //                                                     allBlocksAverageTime /= 60;
    //                                                     blockAverageTime = Math.round(allBlocksAverageTime)
    //                                                     personnelObj["average_block_time"] = blockAverageTime;
    //                                                 }
    //                                                 for (let u = 0; u < uniquescoutBedIds.length; u++) {
    //                                                     //console.log(uniquescoutBedIds[u])

    //                                                     let scoutBedArr = scoutBlocks
    //                                                         .filter(scoutBlock => scoutBlock.plant.bed._id.equals(uniquescoutBedIds[u]));
    //                                                     // console.log(scoutBedArr);

    //                                                     for (let v = 0; v < scoutBedArr.length; v++) {
    //                                                         scoutBedTime = scoutBedArr[v].date;

    //                                                         totalScoutBedTimeArr.push(scoutBedTime);

    //                                                         const maxBedScoutDate = new Date(Math.max.apply(null, totalScoutBedTimeArr));
    //                                                         const minBedScoutDate = new Date(Math.min.apply(null, totalScoutBedTimeArr));
    //                                                         allBedsAverageTime = (maxBedScoutDate.getTime() - minBedScoutDate.getTime()) / 1000;
    //                                                         allBedsAverageTime /= 60;
    //                                                         bedAverageTime = Math.round(allBlocksAverageTime);
    //                                                         bedAverageTimeArr.push(bedAverageTime);
    //                                                     }
    //                                                     console.log(bedAverageTimeArr.length)
    //                                                     break
    //                                                 }

    //                                             }

    //                                             result(null, personnelArray);

    //                                         })
    //                                         .catch(err => {
    //                                             const customError = createError(err.message);
    //                                             result(customError, null);
    //                                         })
    //                                 } else {
    //                                     const customError = createError("scouts not found");
    //                                     result(customError, null);
    //                                 }
    //                             })
    //                             .catch(err => {
    //                                 result(err, null);
    //                             });
    //                     } else {
    //                         const customError = createError("Personnel Type Scout not found");
    //                         result(customError, null);
    //                     }
    //                 })
    //         })
    //         .catch(err => {
    //             result(err, null);
    //         })
    //         .catch(err => {
    //             result(err, null);
    //         })
    // },
    getVarietyAlerts(block, variety, result) {
        let where = {};
        if (!isEmpty(variety)) {
            where["variety"] = variety;
        }
        Plant
            .find(where)
            .populate({
                path: 'bed variety',
                populate: {
                    path: 'block',
                    populate: {
                        path: 'parent',
                    }
                },
            })
            .then((blockPlants) => {
                //console.log(blockPlants)
                Scout
                    .find({
                        "date": {
                            $gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))
                        }
                    })
                    .populate({
                        path: 'entry point issue tolerance issueCategory plant',
                        populate: {
                            path: 'issue_type score bed variety tolerance_type',
                            populate: {
                                path: 'block',
                                populate: 'parent'
                            },
                        }
                    })
                    .then((allScouts) => {

                        IssueType
                            .find()
                            .then((allIssueTypes) => {

                                let farmArray = [];
                                let issueTypeAlert;
                                let parent_threat_level = "Default"
                                let varietyAlerts;
                                let BlockVarArr = [];
                                let allVar;
                                let blockPlantsArr;

                                if (!isEmpty(block)) {
                                    blockPlantsArr = blockPlants.filter(blockPlant => blockPlant.bed.block.parent._id.equals(block));
                                } else {
                                    blockPlantsArr = blockPlants;
                                }
                                //console.log(blockPlantsArr);

                                for (let u = 0; u < blockPlantsArr.length; u++) {
                                    allVar = blockPlantsArr[u].variety.name;
                                    BlockVarArr.push(allVar);
                                }
                                const blockVarietyArr = [...new Set(BlockVarArr)];
                                //console.log(blockVarietyArr)

                                for (let v = 0; v < blockVarietyArr.length; v++) {

                                    let threat_level = "Default";
                                    let variety_name = blockVarietyArr[v];

                                    varietyAlerts = {
                                        variety_name: variety_name,
                                        scout_alert: "",
                                        alert: "Default",
                                        variety_issue_types: [],
                                    };

                                    let scoutsRegisteredArr = allScouts
                                        .filter(scout => scout.plant.variety.name === variety_name);

                                    if (scoutsRegisteredArr.length > 0) {

                                        varietyAlerts["scout_alert"] = "Success";

                                        for (let q = 0; q < allIssueTypes.length; q++) {
                                            let issueTypeId = allIssueTypes[q]._id;
                                            let issueTypeName = allIssueTypes[q].name;
                                            issueTypeAlert = {
                                                issue_type_name: issueTypeName,
                                                issue_type_alert: "",
                                            };

                                            let issueTypesArr = scoutsRegisteredArr.filter(scout => scout.issue.issue_type._id.equals(issueTypeId));

                                            for (let p = 0; p < issueTypesArr.length; p++) {

                                                const score_name = issueTypesArr[p].issue.score.name;
                                                const tolerance_name = (issueTypesArr[p].tolerance) ? issueTypesArr[p].tolerance.name : null;
                                                const value = issueTypesArr[p].value;
                                                const issue_type = issueTypesArr[p].issue.issue_type.name;
                                                threat_level = calculateThreatLevel(threat_level, score_name, tolerance_name, value, issue_type);
                                                issueTypeAlert["issue_type_alert"] = threat_level;
                                            }
                                            varietyAlerts["variety_issue_types"].push(issueTypeAlert);
                                        }

                                    } else {

                                        varietyAlerts["scout_alert"] = "Danger";

                                        for (let n = 0; n < allIssueTypes.length; n++) {
                                            const issueTypeName = allIssueTypes[n].name;
                                            issueTypeAlert = {
                                                issue_type_name: issueTypeName,
                                                alert: "",
                                            };
                                            issueTypeAlert["alert"] = "Default"
                                            varietyAlerts.variety_issue_types.push(issueTypeAlert)
                                        }
                                    }
                                    //console.log(varietyAlerts);

                                    let parentThreatLevelArr = [];
                                    parentThreatLevelArr.push(varietyAlerts)
                                    //console.log(parentThreatLevelArr)
                                    let alertArray = [];
                                    for (let t = 0; t < parentThreatLevelArr.length; t++) {

                                        const scoutAlert = parentThreatLevelArr[t].scout_alert;
                                        alertArray.push(scoutAlert);
                                        let childArray = parentThreatLevelArr[t].variety_issue_types;

                                        for (let k = 0; k < childArray.length; k++) {
                                            const scoutIssueAlert = childArray[k].issue_type_alert;
                                            alertArray.push(scoutIssueAlert)

                                            for (let h = 0; h < alertArray.length; h++) {
                                                let alert = alertArray[h];

                                                parent_threat_level = calculateParentThreatLevel(parent_threat_level,
                                                    alert);
                                            }
                                        }
                                        varietyAlerts["alert"] = parent_threat_level;
                                        farmArray.push(varietyAlerts);
                                    }

                                }
                                result(null, farmArray)
                            })
                            .catch(err => {
                                result(err, null)
                            });


                    })
                    .catch(err => {
                        result(err, null)

                    });
            })
            .catch(err => {
                result(err, null)

            });

    },
    getFarmPrevalence(sdate, edate, block, variety, issue, result) {

        const startDate = sdate;
        const endDate = edate;

        let where = {};
        sdate = new Date(sdate);
        edate = new Date(edate);

        let dateRange = [],
            currentDate = sdate,
            addDays = function (days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            };
        while (currentDate <= edate) {
            dateRange.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }

        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        Tolerance
            .find()
            .populate('tolerance_type')
            .then((allTolerances) => {
                Scout
                    .find({
                        $and: [where,
                            {
                                "created": {
                                    $gte: new Date(startDate),
                                    $lt: new Date(endDate)
                                }
                            }
                        ]
                    })
                    .populate({
                        path: 'entry point issue tolerance issueCategory plant ',
                        populate: {
                            path: 'issue_type score tolerance_type bed variety',
                            populate: {
                                path: "block",
                                populate: "parent"
                            }
                        },
                    })
                    .then(allScouts => {
                        //console.log(allScouts)
                        let issuesArray = [];

                        if (allScouts.length > 1) {
                            let uniqueScoutIssueArr;
                            let color;
                            let currentColor = 0;
                            let formattedDates;
                            let currentToleranceColor = 0;
                            let toleColor;
                            let scoutIssueName;
                            let allColors = [
                                ["#ff6384", "rgba(255, 99, 132, .1)"],
                                ["#ec407a", "rgba(236, 64, 122, .1)"],
                                ["#ab47bc", "rgba(171, 71, 188, .1)"],
                                ["#7e57c2", "rgba(126, 87, 194, .1)"],
                                ["#5c6bc0", "rgba(92, 107, 192, .1)"],
                                ["#42a5f5", "rgba(66, 165, 245, .1)"],
                                ["#29b6f6", "rgba(41, 182, 246, .1)"],
                                ["#26c6da", "rgba(38, 198, 218, .1)"],
                                ["#26a69a", "rgba(38, 166, 154, .1)"],
                                ["#66bb6a", "rgba(102, 187, 106, .1)"],
                                ["#9ccc65", "rgba(156, 204, 101, .1)"],
                                ["#d4e157", "rgba(212, 225, 87, .1)"],
                                ["#f57f17", "rgba(245, 127, 23, .1)"],
                                ["#ffd600", "rgba(255, 214, 0, .1)"],
                                ["#ffab00", "rgba(255, 171, 0, .1)"],
                                ["#e65100", "rgba(230, 81, 0, .1)"],
                                ["#bf360c", "rgba(191, 54, 12, .1)"],
                                ["#3e2723", "rgba(62, 39, 35, .1)"],
                                ["#8d6e63", "rgba(141, 110, 99, .1)"],
                                ["#607d8b", "rgba(96, 125, 139, .1)"],
                                ["#cfd8dc", "rgba(207, 216, 220, .1)"],
                                ["#c51162", "rgba(197, 17, 98, .1)"],
                                ["#e1bee7", "rgba(225, 190, 231, .1)"],
                                ["#6200ea", "rgba(98, 0, 234, .1)"],
                                ["#00bfa5", "rgba(0, 191, 165, .1)"],
                                ["#004d40", "rgba(0, 77, 64, .1)"],
                                ["#006064", "rgba(0, 96, 100, .1)"],
                                ["#01579b", "rgba(1, 87, 155, .1)"],
                            ];
                            let toleranceColors = [
                                ["#4C9A2A", "rgba(1, 87, 155, .1"],
                                ["#ffc100", "rgba(236, 64, 122, .1)"],
                                ["#ff9a00", "rgba(171, 71, 188, .1)"],
                                ["#ff0000", "rgba(255, 99, 132, .1)"],
                            ];
                            let totalToleranceColors = toleranceColors.length;
                            let totalColors = allColors.length;
                            let uniqueIssuesName;
                            let resultObj;
                            let scoutToleranceArr;
                            let toleranceObj;
                            let scouts

                            if (!isEmpty(block) || !isEmpty(variety)) {
                                scouts = allScouts
                                    .filter(scout => scout.plant.bed.block.parent._id.equals(block) || scout.plant.variety._id.equals(variety));
                            }
                            else if (!isEmpty(block) && !isEmpty(variety)) {
                                scouts = allScouts
                                    .filter(scout => scout.plant.bed.block.parent._id.equals(block) && scout.plant.variety._id.equals(variety));
                            }
                            else {
                                scouts = allScouts;
                            }

                            let scoutIssues = scouts.map(function (scout) {
                                return scout.issue.issue_name;
                            });

                            let uniqueIssues = Array.from(new Set(scoutIssues));

                            for (let i = 0; i < uniqueIssues.length; i++) {
                                uniqueIssuesName = uniqueIssues[i];
                                color = allColors[currentColor];
                                currentColor++;
                                if (currentColor >= totalColors) {
                                    currentColor = 0;
                                };
                                resultObj = {
                                    issue_name: uniqueIssuesName,
                                    issue_data: {},
                                };
                                let issueDataObj = {
                                    labels: "",
                                    datasets: [],
                                }

                                let issue = {
                                    label: "",
                                    backgroundColor: color[1],
                                    borderColor: color[0],
                                    data: []
                                }
                                let scoutToleranceTypeId;

                                dateRange.forEach(function (date) {
                                    let totalValues = 0;
                                    let count = 0;
                                    let average = 0;

                                    uniqueScoutIssueArr = scouts
                                        .filter(scout => scout.issue.issue_name === uniqueIssuesName && scout.date.toISOString().slice(0, 10) == date.toISOString().slice(0, 10));

                                    for (let r = 0; r < uniqueScoutIssueArr.length; r++) {

                                        if (uniqueScoutIssueArr[r].tolerance) {
                                            scoutToleranceTypeId = uniqueScoutIssueArr[r].tolerance.tolerance_type._id;
                                        }
                                        if (uniqueScoutIssueArr[r].tolerance) {
                                            scoutToleranceTypeId = uniqueScoutIssueArr[r].tolerance.tolerance_type._id;
                                        }

                                        scoutIssueName = uniqueScoutIssueArr[r].issue.issue_name;
                                        const value = uniqueScoutIssueArr[r].value;
                                        totalValues += +value;
                                        count++;
                                        average = Math.round(totalValues / count);
                                        issue["label"] = scoutIssueName;

                                        scoutToleranceArr = allTolerances
                                            .filter(toleranceType => toleranceType.tolerance_type._id.equals(scoutToleranceTypeId) && toleranceType.name != "Score 5");

                                    }
                                    issue.data.push(average);
                                    formattedDates = dateRange.map(date => {
                                        return moment(date).format("DD/MM/YYYY");
                                    });

                                });
                                issueDataObj["labels"] = formattedDates;
                                issueDataObj.datasets.push(issue);
                                const dateLength = formattedDates.length;
                                for (let q = 0; q < scoutToleranceArr.length; q++) {

                                    toleColor = toleranceColors[currentToleranceColor];
                                    currentToleranceColor++;

                                    if (currentToleranceColor >= totalToleranceColors) {
                                        currentToleranceColor = 0;
                                    };
                                    const toleranceName = scoutToleranceArr[q].name;
                                    const toleranceTo = scoutToleranceArr[q].to;
                                    toleranceObj = {
                                        label: "",
                                        backgroundColor: toleColor[1],
                                        borderColor: toleColor[0],
                                        data: []
                                    }
                                    toleranceObj["label"] = toleranceName;
                                    let toleranceArr = new Array(dateLength).fill(toleranceTo);
                                    toleranceObj["data"] = toleranceArr;
                                    issueDataObj.datasets.push(toleranceObj);
                                }
                                resultObj["issue_data"] = issueDataObj;
                                issuesArray.push(resultObj);

                            }
                        } else {
                            issuesArray = [];
                        }
                        // console.log(issuesArray)

                        for (let n = 0; n < issuesArray.length; n++) {
                            let issueDataDatasets = issuesArray[n].issue_data.datasets[0].data;
                            // console.log(issueDataDatasets)
                            var sum = issueDataDatasets.reduce(function (issueDataDatasets, b) {
                                return issueDataDatasets + b;
                            }, 0);

                            issuesArray.sort(function (a, b) {
                                return a.sum - b.sum;
                            });
                            //console.log(issuesArray)

                        }
                        result(null,
                            issuesArray
                        );
                    })
                    .catch(err => {
                        result(err, null);
                    });
            })
            .catch(err => {
                result(err, null);
            });

    },
    getScoutLocation(date, created_by, block, result) {
        let where = {};

        let startDate = moment(date);
        const today = moment().startOf('day');

        if (!isEmpty(date)) {
            where["date"] = {
                "$gte": startDate,
                "$lt": moment(startDate).add(1, 'days')
            };
        } else {
            where["date"] = {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            };
        }
        if (!isEmpty(created_by)) {
            where["created_by"] = created_by;
        }
        Scout
            .find(where)
            .populate({
                path: 'entry point issue tolerance issueCategory plant',
                populate: {
                    path: 'issue_type score bed variety tolerance_type',
                    populate: {
                        path: 'block',
                        populate: 'parent'
                    },
                }
            })
            .then((scoutLocation) => {

                let scoutLocArr = [];
                let allScoutLocArray = [];

                if (!isEmpty(block)) {
                    scoutLocArr = scoutLocation.filter(scoutLoc => scoutLoc.plant.bed.block.parent._id.equals(block));
                } else {
                    scoutLocArr = scoutLocation;
                }
                for (let s = 0; s < scoutLocArr.length; s++) {
                    let scoutLocObj = {
                        lat: "",
                        lng: "",
                    };
                    const scoutLatitude = parseFloat(scoutLocArr[s].latitude);
                    // console.log(scoutLatitude)
                    const scoutLongitude = parseFloat(scoutLocArr[s].longitude);
                    // console.log(scoutLongitude)
                    scoutLocObj["lat"] = scoutLatitude;
                    scoutLocObj["lng"] = scoutLongitude;
                    allScoutLocArray.push(scoutLocObj);
                }
                result(null, allScoutLocArray)
            })
            .catch(err => {
                result(err, null)
            });


    },

};
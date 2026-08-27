import { useEffect, useState } from "react";
import { getCollections, createCollection, updateCollection, deleteCollection} from "../../services/collectionService";
import CollectionToolbar from "./CollectionToolbar";
import CollectionTable from "./CollectionTable";
import CollectionForm from "../../components/forms/CollectionForm";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useSearchParams, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Collections() {

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [deleteCollectionItem, setDeleteCollectionItem] = useState(null);
    const [searchParams] = useSearchParams();
    const location=useLocation();
    const [highlightedId,setHighlightedId]=useState(location.state?.highlightCollectionId);

    useEffect(()=>{
        if(!highlightedId)return;
        const timer=setTimeout(()=>{
            setHighlightedId(null);
        },3000);
        return ()=>clearTimeout(timer);
    },[highlightedId]);

    useEffect(() => {
        loadCollections();
        if (searchParams.get("create") === "true") {
            setEditingCollection(null);
            setShowForm(true);
        }
    }, [searchParams]);

    const loadCollections = async () => {
        setLoading(true);
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingCollection) {
                await updateCollection(editingCollection.id, formData);
            } else {
                await createCollection(formData);
            }
            
            // Re-load fresh from backend to get correct property casing
            await loadCollections();
            
            setShowForm(false);
            setEditingCollection(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!deleteCollectionItem) return;
        try {
            await deleteCollection(deleteCollectionItem.id);
            // Filter out locally without jumping scroll
            setCollections((prev) => prev.filter((col) => col.id !== deleteCollectionItem.id));
            setDeleteCollectionItem(null);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredCollections = collections.filter((collection) =>
        (collection.name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    if (loading) {
        return <LoadingSpinner/>
    }
    return (
        <div className="space-y-6">
            <div className="bg-slate-100 p-8 rounded-2xl shadow-sm">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Collections
                </h1>
                <p className="mt-2 text-slate-500">
                    Organize your mock endpoints into collections.
                </p>
            </div>

            <CollectionToolbar
                search={search}
                setSearch={setSearch}
                totalCollections={filteredCollections.length}
                onCreate={() => {
                    setEditingCollection(null);
                    setShowForm(true);
                }}
            />

            <Modal
                open={showForm}
                title={
                    editingCollection
                        ? "Edit Collection"
                        : "Create Collection"
                }
                onClose={() => {
                    setShowForm(false);
                    setEditingCollection(null);
                }}
            >

                <CollectionForm
                    collection={editingCollection}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingCollection(null);
                    }}
                />
            </Modal>

            <ConfirmDialog
                open={!!deleteCollectionItem}
                message={`Are you sure you want to delete the collection "${deleteCollectionItem?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteCollectionItem(null)}
            />

            <CollectionTable
                collections={filteredCollections}
                highlightedId={highlightedId}
                onEdit={(collection) => {
                    setEditingCollection(collection);
                    setShowForm(true);
                }}
                onDelete={(collection) => {
                    setDeleteCollectionItem(collection);
                }}
                onCreate={() => {
                    setEditingCollection(null);
                    setShowForm(true);
                }}
            />
        </div>
    );
}

export default Collections;
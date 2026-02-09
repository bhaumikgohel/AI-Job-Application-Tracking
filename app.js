const { useState, useEffect } = React;

const JOB_COLUMNS = [
    { id: 'todo', title: 'To Research' },
    { id: 'applied', title: 'Applied' },
    { id: 'interviewing', title: 'Interviewing' },
    { id: 'done', title: 'Completed' }
];

const JobCard = ({ job, onMove, onDelete }) => (
    <div className="job-card glass animate-in">
        <span className="company-name">{job.company}</span>
        <h4>{job.role}</h4>
        <div className="card-meta">
            <span className="badge"><i data-lucide="map-pin" size="12"></i> {job.platform}</span>
            <span className="badge"><i data-lucide="link" size="12"></i> {job.source}</span>
            <span className="badge warning"><i data-lucide="file-text" size="12"></i> {job.resume}</span>
        </div>
        {job.notes && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>{job.notes}</p>}

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <select
                value={job.status}
                onChange={(e) => onMove(job.id, e.target.value)}
                style={{ fontSize: '0.7rem', padding: '0.2rem' }}
            >
                {JOB_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
            </select>
            <button onClick={() => onDelete(job.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.7rem' }}>Delete</button>
        </div>
    </div>
);

const App = () => {
    const [jobs, setJobs] = useState(() => {
        const saved = localStorage.getItem('jb_assistant_jobs');
        return saved ? JSON.parse(saved) : [];
    });
    const [showModal, setShowModal] = useState(false);
    const [newJob, setNewJob] = useState({
        company: '', role: '', platform: '', source: '', resume: '', notes: '', status: 'todo'
    });

    useEffect(() => {
        localStorage.setItem('jb_assistant_jobs', JSON.stringify(jobs));
        // Initialize Lucide icons after render
        if (window.lucide) {
            lucide.createIcons();
        }
    }, [jobs, showModal]);

    const handleAddJob = (e) => {
        e.preventDefault();
        const job = { ...newJob, id: Date.now() };
        setJobs([...jobs, job]);
        setNewJob({ company: '', role: '', platform: '', source: '', resume: '', notes: '', status: 'todo' });
        setShowModal(false);
    };

    const moveJob = (id, newStatus) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    };

    const deleteJob = (id) => {
        if (confirm('Are you sure you want to delete this job entry?')) {
            setJobs(jobs.filter(j => j.id !== id));
        }
    };

    return (
        <div className="container">
            <header className="dashboard-header animate-in">
                <div className="logo-section">
                    <h1>CareerFlow</h1>
                    <p>Tracking your journey to the next big role</p>
                </div>
                <div className="stats" style={{ display: 'flex', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{jobs.length}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL APPS</div>
                    </div>
                    <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--success)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>
                            {jobs.filter(j => j.status === 'done').length}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COMPLETED</div>
                    </div>
                </div>
            </header>

            <main className="kanban-board">
                {JOB_COLUMNS.map(col => (
                    <div key={col.id} className="kanban-column glass">
                        <div className="column-header">
                            <h3>{col.title}</h3>
                            <span className="job-count">{jobs.filter(j => j.status === col.id).length}</span>
                        </div>
                        <div className="column-content">
                            {jobs.filter(j => j.status === col.id).map(job => (
                                <JobCard key={job.id} job={job} onMove={moveJob} onDelete={deleteJob} />
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            <button className="add-btn" onClick={() => setShowModal(true)}>
                <i data-lucide="plus"></i>
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass animate-in">
                        <div className="modal-header">
                            <h2>Add New Job Application</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter the details of your latest application</p>
                        </div>
                        <form onSubmit={handleAddJob}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input required value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="e.g. Google" />
                                </div>
                                <div className="form-group">
                                    <label>Job Title / Role</label>
                                    <input required value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="e.g. Senior Dev" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Where did you apply? (Platform)</label>
                                <input value={newJob.platform} onChange={e => setNewJob({ ...newJob, platform: e.target.value })} placeholder="e.g. LinkedIn, Company Portal" />
                            </div>
                            <div className="form-group">
                                <label>How did you get it? (Source)</label>
                                <input value={newJob.source} onChange={e => setNewJob({ ...newJob, source: e.target.value })} placeholder="e.g. Referral, Outreach, Cold Apply" />
                            </div>
                            <div className="form-group">
                                <label>Resume Version Used</label>
                                <input value={newJob.resume} onChange={e => setNewJob({ ...newJob, resume: e.target.value })} placeholder="e.g. FullStack_v2.pdf" />
                            </div>
                            <div className="form-group">
                                <label>Notes / Progress Update</label>
                                <textarea rows="3" value={newJob.notes} onChange={e => setNewJob({ ...newJob, notes: e.target.value })} placeholder="Initial research, follow-up date, etc."></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Entry</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

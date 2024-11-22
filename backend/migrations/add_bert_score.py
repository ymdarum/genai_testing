from app import db

def upgrade():
    # Add the bert_score column
    db.engine.execute('ALTER TABLE test_results ADD COLUMN bert_score FLOAT NOT NULL DEFAULT 0.0')

def downgrade():
    # Remove the bert_score column
    db.engine.execute('ALTER TABLE test_results DROP COLUMN bert_score')

if __name__ == '__main__':
    upgrade() 
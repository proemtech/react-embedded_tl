import React from "react";
import { useParams } from "react-router-dom";

export default function TrainPage() {
  const { trainIdent, searchDate } = useParams();
  return (
    <div>
      <p>
        Train ident: {trainIdent}
        {searchDate && (
          <>
            <br />
            Search date: {searchDate}
          </>
        )}
      </p>
    </div>
  );
}
